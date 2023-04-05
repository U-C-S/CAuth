use std::{
  collections::HashMap,
  time::{SystemTime, UNIX_EPOCH},
};

use axum::{
  extract::{Path, State},
  http::StatusCode,
  response::{IntoResponse, Response},
  routing::{get, post},
  Json, Router,
};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::models::{self, token::JwtPayloadForServManage, IClient, Service, SharedState};

pub fn service_routes(state: models::SharedState) -> Router<()> {
  Router::new()
    .route("/get/:entity_type/:serv_name", get(get_service_info))
    .route("/get/all_owned_services", get(get_all_owned_services))
    .route("/get/all_owned_clients", get(get_all_owned_clients))
    .route("/get/all_services", get(get_all_services))
    .route("/add", post(add_service))
    .nest("/auth", service_manage_auth_routes())
    .with_state(state)
}

#[derive(Deserialize, Serialize)]
pub struct ServicesListResponse {
  name: String,
  api: String,
  description: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct ClientListResponse {
  name: String,
  description: Option<String>,
  services_access: Vec<String>,
}

#[derive(Deserialize, Serialize)]
pub struct ServicesListResponseWithUsers {
  name: String,
  api: String,
  description: Option<String>,
  owner: String,
}

#[axum_macros::debug_handler]
async fn get_all_services(State(state): State<SharedState>) -> impl IntoResponse {
  let services = state.read().await.services.clone();

  let x: Vec<_> = services
    .iter()
    .map(|(key, val)| ServicesListResponseWithUsers {
      name: key.clone(),
      api: val.api.clone(),
      description: val.description.clone(),
      owner: val.user.clone(),
    })
    .collect();

  Json(x)
}

#[axum_macros::debug_handler]
async fn get_all_owned_services(
  State(state): State<SharedState>,
  claims: JwtPayloadForServManage,
) -> impl IntoResponse {
  let services = state.read().await.services.clone();

  let x: Vec<_> = services
    .iter()
    .filter(|(_, val)| val.user == claims.user_name)
    .map(|(key, val)| ServicesListResponse {
      name: key.clone(),
      api: val.api.clone(),
      description: val.description.clone(),
    })
    .collect();

  Json(x)
}

#[axum_macros::debug_handler]
async fn get_all_owned_clients(
  State(state): State<SharedState>,
  claims: JwtPayloadForServManage,
) -> impl IntoResponse {
  let clients = state.read().await.clients.clone();

  let x: Vec<_> = clients
    .iter()
    .filter(|(_, val)| val.owner == claims.user_name)
    .map(|(key, val)| ClientListResponse {
      name: key.clone(),
      description: val.description.clone(),
      services_access: val.services_access.clone(),
    })
    .collect();

  Json(x)
}

#[derive(Debug, Deserialize, Serialize)]
enum UnionResponse<T, U, Err> {
  App(T),
  Serv(U),
  Err(Err),
}

impl<T, U, Err> IntoResponse for UnionResponse<T, U, Err>
where
  T: IntoResponse,
  U: IntoResponse,
  Err: IntoResponse,
{
  fn into_response(self) -> Response {
    match self {
      UnionResponse::App(x) => x.into_response(),
      UnionResponse::Serv(x) => x.into_response(),
      UnionResponse::Err(x) => x.into_response(),
    }
  }
}

#[axum_macros::debug_handler]
async fn get_service_info(
  State(state): State<SharedState>,
  Path((entity_type, serv_name)): Path<(String, String)>,
) -> impl IntoResponse {
  let x = state.read().await;

  if entity_type == "service" {
    if let Some(val) = x.services.get(&serv_name) {
      UnionResponse::Serv(Json(val.clone()))
    } else {
      UnionResponse::Err(StatusCode::NOT_FOUND)
    }
  } else if entity_type == "application" {
    if let Some(val) = x.clients.get(&serv_name) {
      UnionResponse::App(Json(val.clone()))
    } else {
      UnionResponse::Err(StatusCode::NOT_FOUND)
    }
  } else {
    UnionResponse::Err(StatusCode::NOT_FOUND)
  }
}

#[derive(serde::Deserialize)]
struct ServiceReq {
  name: String,
  api: Option<String>,
  description: Option<String>,
  service_access: Option<Vec<String>>,
  is_client: bool,
}

#[derive(serde::Serialize)]
struct GenericResponse {
  status: String,
  message: String,
}

#[axum_macros::debug_handler]
async fn add_service(
  State(state): State<SharedState>,
  claims: JwtPayloadForServManage,
  Json(payload): Json<ServiceReq>,
) -> impl IntoResponse {
  let services = &mut state.write().await;

  //todo: check if entity already exists

  if payload.is_client {
    services.clients.insert(
      payload.name,
      IClient {
        owner: claims.user_name,
        services_access: payload.service_access.unwrap_or_default(),
        description: payload.description,
      },
    );
  } else {
    services.services.insert(
      payload.name,
      Service {
        api: payload.api.unwrap_or_default(),
        description: payload.description,
        user: claims.user_name,
      },
    );
  }

  Json(HashMap::from([
    ("status", "success"),
    ("message", "Service added"),
  ]))
}

#[derive(Debug, Serialize, Deserialize)]
struct ServiceAuthReq {
  user_name: String,
  password: String,
}

fn service_manage_auth_routes() -> Router<SharedState> {
  #[axum_macros::debug_handler]
  async fn loginroute(
    State(state): State<SharedState>,
    Json(creds): Json<ServiceAuthReq>,
  ) -> impl IntoResponse {
    let users = &state.read().await.users;

    if let Some(user) = users.get(&creds.user_name) {
      if user.password == creds.password {
        let key = encode(
          &Header::default(),
          &JwtPayloadForServManage {
            user_name: creds.user_name,
            exp: SystemTime::now()
              .duration_since(UNIX_EPOCH)
              .unwrap()
              .as_secs()
              + 50000,
          },
          &EncodingKey::from_secret("secret".as_ref()),
        );

        Ok(key.unwrap())
      } else {
        Err(StatusCode::UNAUTHORIZED)
      }
    } else {
      Err(StatusCode::UNAUTHORIZED)
    }
  }

  Router::new().route("/login", get(loginroute))
}
