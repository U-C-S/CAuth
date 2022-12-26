use axum::routing::get;
use axum::Router;

pub fn routes() -> Router {
    Router::new().route(
        "/echo",
        get(|| async { "echo" }).post(|body: String| async { body }),
    )
}
