use axum::{routing::get, Router};

pub fn service_routes() -> Router {
  Router::new()
    .route("/admin", get(get_service_info))
    .route("/user", get(get_service_info))
}

#[axum_macros::debug_handler]
async fn get_service_info() -> &'static str {
  "Get service info"
}

async fn add_service() -> &'static str {
  "Add service"
}

async fn delete_service() -> &'static str {
  "Delete service"
}

async fn update_service() -> &'static str {
  "Update service"
}
