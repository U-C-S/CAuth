use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};

use crate::models::{self, Service, SharedState};

pub fn service_routes(state: models::SharedState) -> Router<()> {
  Router::new()
    .route("/admin", get(get_service_info))
    .route("/user", get(get_service_info))
    .with_state(state)
}

#[axum_macros::debug_handler]
async fn get_service_info(State(state): State<SharedState>) -> impl IntoResponse {
  let x = &mut state.write().await.services;
  let y = format!("{:?}", x);

  x.insert(
    "hi".to_string(),
    Service {
      api: "hi".to_string(),
      description: "hi".to_string(),
      user: "lol".to_string(),
    }
  );

  Json(y)
}

async fn add_service() -> &'static str {
  "Add service"
}

async fn delete_service() -> &'static str {
  "Delete service"
}

async fn update_service() -> &'static str {
  "Update service"
}
