use axum::{response::IntoResponse, routing::post, Json, Router};

pub fn routes() -> Router {
    Router::new().route("/echo", post(service_reg))
}

pub struct ServiceInfo {
    name: String,
    description: Option<String>,
    api_url: String,
}

struct ServiceReq {
    owner_key: Option<String>,
    service_info: ServiceInfo,
}

pub async fn service_reg(Json(payload): Json<ServiceReq>) -> impl IntoResponse {
    "meow"
}

async fn service_update(Json(payload): Json<ServiceReq>) -> impl IntoResponse {}

async fn service_delete() -> impl IntoResponse {}
