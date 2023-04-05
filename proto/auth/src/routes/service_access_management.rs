use axum::{
  routing::{get, post},
  Router,
};

use crate::models;

pub fn service_access_routes(state: models::SharedState) -> Router<()> {
  Router::new().with_state(state)
}
