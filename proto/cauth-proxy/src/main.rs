mod state;

use std::net::SocketAddr;

use axum::{
  extract::State,
  http::{HeaderMap, Method, StatusCode},
  routing::{any, get},
  Router, Server,
};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
  let pg_pool = state::create_postgres_instance().await;

  let app = Router::new()
    .route("/", get(|| async { "Echo!" }))
    .route("/query", any(handler))
    .layer(CorsLayer::new().allow_origin(Any).allow_headers(Any))
    .with_state(pg_pool);

  let addr = SocketAddr::from(([127, 0, 0, 1], 3721));
  println!("Listening on http://{}", addr);

  Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}

async fn handler(headers: HeaderMap, method: Method, State(pg_state): State<state::PgSqlPool>) {
  let req_service_name = headers.get("service-name").unwrap().to_str().unwrap();
  let req_endpoint = headers.get("service-endpoint").unwrap().to_str().unwrap();
  let req_headers = headers.get("service-headers").unwrap();

  println!("{}", method);

  let conn = pg_state.get().await.unwrap();

  let preparee = conn
    .prepare("SELECT api_base_url FROM ServiceTable WHERE service_name=$1")
    .await
    .unwrap();

  let sql_params: Vec<String> = vec![req_service_name.into()];
  let api_url = conn.query_raw(
    "SELECT api_base_url FROM ServiceTable WHERE service_name=$1",
    sql_params,
  );
}
