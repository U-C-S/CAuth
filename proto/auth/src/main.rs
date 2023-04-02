pub mod models;
pub mod routes;

use std::{collections::HashMap, net::SocketAddr, sync::Arc};

use axum::{routing::get, Router, Server};
use tokio::sync::RwLock;

use crate::models::{Service, State};

#[tokio::main]
async fn main() {
  // let serv =
  let state = State {
    services: HashMap::from([(
      "google".to_string(),
      Service {
        api: "google".to_string(),
        description: "google".to_string(),
        user: "lol".to_string(),
      },
    )]),
    users: HashMap::new(),
  };
  let shared_state = Arc::new(RwLock::new(state));

  let app = Router::new()
    .route("/", get(|| async { "Hello, World!" }))
    .nest(
      "/service",
      routes::service_management::service_routes(shared_state),
    )
    .nest("/api", routes::service_api::service_api_routes());

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}

fn lol() {}
