use std::collections::HashMap;

use axum::{extract::State, response::IntoResponse, Json};

use crate::models::{token::JwtPayloadForServManage, IClient, Service, SharedState};

#[derive(serde::Deserialize)]
pub struct ServiceReq {
  name: String,
  api: Option<String>,
  description: Option<String>,
  service_access: Option<Vec<String>>,
  is_client: bool,
}

#[derive(serde::Serialize)]
pub struct GenericResponse {
  pub status: String,
  pub message: String,
}

#[axum_macros::debug_handler]
pub(crate) async fn add_service(
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
