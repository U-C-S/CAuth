use axum::{routing::any, Router};

pub fn service_api_routes() -> Router {
  Router::new().route("/:service", any(use_service_api))
}

async fn use_service_api() -> &'static str {
  "Get service api info"
}
