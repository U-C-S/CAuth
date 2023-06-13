mod state;

use std::net::SocketAddr;

use axum::{
  body::Bytes,
  extract::State,
  headers::{authorization::Bearer, Authorization},
  http::{HeaderMap, Method},
  routing::{any, get},
  Router, Server, TypedHeader,
};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use sqlx::query_as;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
  // dotenvy::dotenv();
  // for (key, val) in env::vars() {
  //   if key == "DATABASE_URL" {
  //     DATABASE_URL = val;
  //   }
  // }

  let database_url: String = String::from("postgres://postgres:3721@localhost/cauth"); // TODO

  let pg_pool = state::create_postgres_instance(&database_url)
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

async fn handler(
  headers: HeaderMap,
  method: Method,
  TypedHeader(token): TypedHeader<Authorization<Bearer>>,
  State(pg_state): State<state::PgPoolType>,
  body: Bytes,
) {
  let service_headers: Result<ServiceHeaders, &str> = {
    let (n, e, h) = (
      headers.get("service-name"),
      headers.get("service-endpoint"),
      headers.get("service-headers"),
    );

    match (n, e, h) {
      (Some(n), Some(e), None) => Ok(ServiceHeaders {
        name: n.to_str().expect("Invalid service-name"),
        endpoint: e.to_str().expect("Invalid service-endpoint"),
        headers: "",
      }),

      (Some(n), Some(e), Some(h)) => Ok(ServiceHeaders {
        name: n.to_str().unwrap(),
        endpoint: e.to_str().unwrap(),
        headers: h.to_str().unwrap(),
      }),

      _ => Err("Invalid/Missing headers"),
    }
  };

  let payload = decode::<BearerTokenPayload>(
    token.token(),
    &DecodingKey::from_secret("supersecret".as_ref()), // TODO
    &Validation::new(Algorithm::HS256),
  )
  .expect("Invalid token");

  let row = query_as!(
    ServiceTable,
    "select id,api_base_uri from service_table where 
      service_name=$1
        and 
      id in (select service_table_id from services_used_by_apps where app_table_id=$2)",
    service_headers.unwrap().name,
    payload.claims.appid,
  )
  .fetch_one(&pg_state)
  .await
  .unwrap();

  // next steps:
  // - get api_base_url from row which matches with service-name
  // - call the service with api_base_url + service-endpoint
  // - return the response to the client
}

struct ServiceHeaders<'a> {
  name: &'a str,
  endpoint: &'a str,
  headers: &'a str,
}

#[derive(sqlx::Type)]
struct ServiceTable {
  id: i32,
  api_base_uri: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct BearerTokenPayload {
  appid: i32,
  services_accessing: Vec<i32>,
  // config: String, // Use JWE to encrypt config
}
