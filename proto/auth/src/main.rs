pub mod models;
pub mod routes;

use std::{net::SocketAddr, sync::Arc};

use axum::{routing::get, Router, Server};
use tokio::sync::RwLock;

use crate::models::shared_state;

#[tokio::main]
async fn main() {
  let shared_state = Arc::new(RwLock::new(shared_state()));

  let app = Router::new().route("/", get(|| async { "Echo!" })).nest(
    "/service",
    routes::service_management::service_routes(shared_state),
  );

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}
