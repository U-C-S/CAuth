mod state;

use std::net::SocketAddr;

use axum::{routing::get, Router, Server};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
  let pg_pool = state::create_postgres_instance().await;

  let app = Router::new()
    .route("/", get(|| async { "Echo!" }))
    .layer(CorsLayer::new().allow_origin(Any).allow_headers(Any))
    .with_state(pg_pool);

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}
