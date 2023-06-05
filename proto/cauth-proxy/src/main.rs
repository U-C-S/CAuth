mod state;

use std::{env, net::SocketAddr};

use axum::{
  extract::State,
  http::{HeaderMap, Method, StatusCode},
  routing::{any, get},
  Router, Server,
};
use sqlx::{query, query_as};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
  // dotenvy::dotenv();
  // for (key, val) in env::vars() {
  //   if key == "DATABASE_URL" {
  //     DATABASE_URL = val;
  //   }
  // }

  let mut DATABASE_URL: String = String::from("postgres://postgres:3721@localhost/cauth");

  let pg_pool = state::create_postgres_instance(&DATABASE_URL)
    .await
    .unwrap();

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

async fn handler(headers: HeaderMap, method: Method, State(pg_state): State<state::PgPoolType>) {
  let req_service_name = headers.get("service-name").unwrap().to_str().unwrap();
  // println!("{}", req_service_name);
  // let req_endpoint = headers.get("service-endpoint").unwrap().to_str().unwrap();
  // let req_headers = headers.get("service-headers").unwrap();

  println!("{}", method);

  let row: (i64,) = query_as("SELECT api_base_uri FROM service_table WHERE service_name=$1")
    .bind(req_service_name)
    .fetch_one(&pg_state)
    .await
    .unwrap();

  // println!("{}", row);

  let rowx = query!("SELECT key,value FROM keyvalue")
    .fetch_all(&pg_state)
    .await
    .unwrap();
  let val = rowx.len();
  println!("{}", val);

  // let api_url = conn.query(&preparee, &prepare_params).await.unwrap();
}

struct Service {
  service_name: String,
  description: String,
  api_base_url: String,
  id: i64,
}
