pub mod routes;

use std::net::SocketAddr;

use axum::{routing::get, Router, Server};

#[tokio::main]
async fn main() {
  let app = Router::new()
    .route("/", get(|| async { "Hello, World!" }))
    .nest("/service", routes::service_management::service_routes())
    .nest("/api", routes::service_api::service_api_routes());

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}
