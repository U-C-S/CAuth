use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new().nest("/", nesting_routes());

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn nesting_routes() -> Router {
    async fn echo() -> String {
        String::from("Echo")
    }

    Router::new().route("/echo", get(echo))
}
