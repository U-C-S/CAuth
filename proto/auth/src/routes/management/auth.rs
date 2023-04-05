use std::time::{SystemTime, UNIX_EPOCH};

use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::models::{token::JwtPayloadForServManage, SharedState};

#[derive(Debug, Serialize, Deserialize)]
struct ServiceAuthReq {
  user_name: String,
  password: String,
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
            user_name: creds.user_name,
            exp: SystemTime::now()
              .duration_since(UNIX_EPOCH)
              .unwrap()
              .as_secs()
              + 50000,
          },
          &EncodingKey::from_secret("secret".as_ref()),
        );

        Ok(key.unwrap())
      } else {
        Err(StatusCode::UNAUTHORIZED)
      }
    } else {
      Err(StatusCode::UNAUTHORIZED)
    }
  }

  Router::new().route("/login", get(loginroute))
}
