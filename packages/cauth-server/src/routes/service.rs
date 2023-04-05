use axum::{response::IntoResponse, routing::post, Json, Router};
use serde::{Deserialize, Serialize};

pub fn routes() -> Router {
  Router::new().route("/echo", post(service_reg))
}
#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceInfo {
  name: String,
  description: Option<String>,
  api_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceReq {
  owner_key: Option<String>,
  service_info: ServiceInfo,
}

pub async fn service_reg(Json(payload): Json<ServiceReq>) -> impl IntoResponse {
  payload.service_info.name
}
