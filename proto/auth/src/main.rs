pub mod models;
pub mod routes;
pub mod state;

use std::net::SocketAddr;

use axum::{routing::get, Router, Server};

use crate::state::shared_state;

#[tokio::main]
async fn main() {
  let shared_state = shared_state();

  let app = Router::new()
    .route("/", get(|| async { "Echo!" }))
    .nest("/manage", routes::management::service_routes())
    .with_state(shared_state);

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}
