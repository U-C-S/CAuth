use std::time::{SystemTime, UNIX_EPOCH};

use axum::{
  extract::State,
  http::StatusCode,
  response::IntoResponse,
  routing::{get, post},
  Json, Router,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::{models::token::JwtPayloadForServManage, state::SharedState};

#[derive(Debug, Serialize, Deserialize)]
struct ServiceAuthReq {
  user_name: String,
  password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct MSLoginRes {
  token: String,
  user_name: String,
}

struct ServiceAccessTokenPayload {
  user_name: String,

  exp: u64,
}

struct ServiceAccessFormat<T> {
  key: String,
  data: Option<T>,
}

pub(crate) fn manage_auth_routes() -> Router<SharedState> {
  #[axum_macros::debug_handler]
  async fn loginroute(
    State(state): State<SharedState>,
    Json(creds): Json<ServiceAuthReq>,
  ) -> impl IntoResponse {
    let users = &state.read().await.users;

    if let Some(user) = users.get(&creds.user_name) {
      if user.password == creds.password {
        let key = encode(
          &Header::default(),
          &JwtPayloadForServManage {
            user_name: creds.user_name.clone(),
            exp: SystemTime::now()
              .duration_since(UNIX_EPOCH)
              .unwrap()
              .as_secs()
              + 50000,
          },
          &EncodingKey::from_secret("secret".as_ref()),
        );

        Ok(Json(MSLoginRes {
          token: key.unwrap(),
          user_name: creds.user_name,
        }))
      } else {
        Err(StatusCode::UNAUTHORIZED)
      }
    } else {
      Err(StatusCode::UNAUTHORIZED)
    }
  }

  async fn generateAccessToken(
    State(state): State<SharedState>,
    Json(creds): Json<ServiceAccessFormat<()>>,
  ) -> impl IntoResponse {
    let users = &state.read().await.users;

    let user = decode::<JwtPayloadForServManage>(
      &creds.key,
      &DecodingKey::from_secret("secret".as_ref()),
      &Validation::default(),
    )
    .unwrap();

    if users.contains_key(&user.claims.user_name) {}
  }

  Router::new().route("/login", post(loginroute))
}
