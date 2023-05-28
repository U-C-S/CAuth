use axum::{
  async_trait,
  extract::{FromRequestParts, TypedHeader},
  headers::{authorization::Bearer, Authorization},
  http::request::Parts,
  RequestPartsExt,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::models::auth_error::AuthError;

#[derive(Debug, Serialize, Deserialize)]
pub struct JwtPayloadForServManage {
  pub user_name: String,
  pub exp: u64,
}

#[async_trait]
impl<S> FromRequestParts<S> for JwtPayloadForServManage
where
  S: Send + Sync,
{
  type Rejection = AuthError;

  async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
    let TypedHeader(Authorization(bearer)) = parts
      .extract::<TypedHeader<Authorization<Bearer>>>()
      .await
      .map_err(|_| AuthError::InvalidToken)?;

    let token_data = decode::<JwtPayloadForServManage>(
      bearer.token(),
      &DecodingKey::from_secret("secret".as_ref()),
      &Validation::default(),
    );

    match token_data {
      Ok(x) => {
        // todo: check if token's user_name is in the list of users

        Ok(x.claims)
      }
      Err(e) => {
        println!("Error in token: {}", e.to_string());
        Err(AuthError::InvalidToken)
      }
    }
  }
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
