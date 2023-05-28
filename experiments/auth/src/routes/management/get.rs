use axum::{
  extract::{Path, State},
  http::StatusCode,
  response::{IntoResponse, Response},
  Json,
};
use serde::{Deserialize, Serialize};

use crate::{models::token::JwtPayloadForServManage, state::SharedState};

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
pub(crate) async fn get_all_services(State(state): State<SharedState>) -> impl IntoResponse {
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
pub(crate) async fn get_all_owned_services(
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
pub(crate) async fn get_all_owned_clients(
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
pub(crate) async fn get_service_info(
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
