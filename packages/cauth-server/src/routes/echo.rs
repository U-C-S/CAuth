use axum::response::IntoResponse;
use axum::routing::get;
use axum::Router;

pub fn routes() -> Router {
    Router::new().route("/echo", get(|| async { "echo" }).post(echo_response))
}

pub async fn echo_response(body: String) -> impl IntoResponse {
    body
}
