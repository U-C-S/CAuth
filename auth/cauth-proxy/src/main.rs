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

  let mut DATABASE_URL: String = String::from("postgres://postgres:3721@localhost/cauth"); // TODO

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
    &DecodingKey::from_secret("secret".as_ref()), // TODO
    &Validation::new(Algorithm::HS256),
  )
  .expect("Invalid token");

  let row: (i64,) = query_as(
    "SELECT serviceTableId, api_base_url, config FROM services_used_by_apps WHERE appTableId=$1",
  )
  .bind(payload.claims.appid)
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

#[derive(Debug, Serialize, Deserialize)]
struct BearerTokenPayload {
  appid: i64,
  // config: String, // Use JWE to encrypt config
  service_access_ids: Vec<i64>,
}
