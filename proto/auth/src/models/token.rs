use axum::{
  async_trait,
  extract::{FromRequestParts, TypedHeader},
  headers::{authorization::Bearer, Authorization},
  http::{request::Parts, StatusCode},
  response::{IntoResponse, Response},
  Json, RequestPartsExt,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct JwtPayload {
  pub user_name: String,
  pub service_access: Vec<String>,
  pub exp: usize,
}

#[async_trait]
impl<S> FromRequestParts<S> for JwtPayload
where
  S: Send + Sync,
{
  type Rejection = AuthError;

  async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
    let TypedHeader(Authorization(bearer)) = parts
      .extract::<TypedHeader<Authorization<Bearer>>>()
      .await
      .map_err(|_| AuthError::InvalidToken)?;

    let token_data = decode::<Self>(
      bearer.token(),
      &DecodingKey::from_secret("lol".as_ref()),
      &Validation::default(),
    )
    .map_err(|_| AuthError::InvalidToken)?;

    Ok(token_data.claims)
  }
}

pub enum AuthError {
  WrongCredentials,
  MissingCredentials,
  TokenCreation,
  InvalidToken,
}

impl IntoResponse for AuthError {
  fn into_response(self) -> Response {
    let (status, error_message) = match self {
      AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
      AuthError::MissingCredentials => (StatusCode::BAD_REQUEST, "Missing credentials"),
      AuthError::TokenCreation => (StatusCode::INTERNAL_SERVER_ERROR, "Token creation error"),
      AuthError::InvalidToken => (StatusCode::BAD_REQUEST, "Invalid token"),
    };
    let body = Json(json!({
        "error": error_message,
    }));
    (status, body).into_response()
  }
}

pub enum AccessEntityType {
  Application,     //can only access other services
  Service,         //can only provide services
  ServiceAsClient, //can access other services and provide services
}

/*
JWTs for Cl-AS-S Model
- for app to access services API
- for user to manage
  - register services
  - select services to access
- for authserver to call service API internally


JWTs for Cl-S-AS Model
- for app to directly access services API
- for service to access authserver API

 */
