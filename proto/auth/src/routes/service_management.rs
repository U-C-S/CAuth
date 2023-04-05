use std::{
  collections::HashMap,
  time::{SystemTime, UNIX_EPOCH},
};

use axum::{
  extract::{Path, State},
  http::StatusCode,
  response::IntoResponse,
  routing::{get, post},
  Json, Router,
};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::models::{self, token::JwtPayloadForServManage, Service, SharedState};

pub fn service_routes(state: models::SharedState) -> Router<()> {
  Router::new()
    .route("/get/:serv_name", get(get_service_info))
    .route("/get/all_owned_services", get(get_all_owned_services))
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
async fn get_service_info(
  State(state): State<SharedState>,
  Path(serv_name): Path<String>,
) -> impl IntoResponse {
  let x = state.read().await.services.clone();

  println!("{:?}", serv_name);

  if let Some(val) = x.get(&serv_name) {
    Ok(Json(val.clone()))
  } else {
    Err(StatusCode::NOT_FOUND)
  }
}

#[derive(serde::Deserialize)]
struct ServiceReq {
  name: String,
  api: String,
  description: Option<String>,
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
  let services = &mut state.write().await.services;

  let ins = services.insert(
    payload.name,
    Service {
      api: payload.api,
      description: payload.description,
      user: claims.user_name,
    },
  );

  if ins.is_none() {
    Ok(Json(HashMap::from([
      ("status", "success"),
      ("message", "Service added"),
    ])))
  } else {
    Err(StatusCode::BAD_REQUEST)
  }
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
