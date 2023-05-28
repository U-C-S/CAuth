use axum::{
  extract::{FromRequestParts, Path, State},
  routing::get,
  Router,
};
use serde::{Deserialize, Serialize};

use crate::state::SharedState;

pub async fn routes() -> Router<SharedState> {
  Router::new().route("/getaccesstoken/:client", get(getaccesstoken))
}

#[derive(Debug, Serialize, Deserialize)]
struct ClientJwtPayload {
  pub client_name: String,
  pub exp: usize,
}

async fn getaccesstoken(State(state): State<SharedState>, Path(client): Path<String>) {
  let x = state.read().await;
}
