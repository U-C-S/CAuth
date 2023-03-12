use axum::{routing::get, Router};

pub fn service_routes() -> Router {
  let get_serv_info = get(get_serv_info);

  Router::new().route("/", get(|| async { "Hello, World!" }))
}

#[axum_macros::debug_handler]
async fn get_serv_info() -> &'static str {
  "Get service info"
}
