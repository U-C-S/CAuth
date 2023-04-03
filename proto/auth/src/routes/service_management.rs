use axum::{
  extract::{Path, State},
  http::StatusCode,
  response::IntoResponse,
  routing::get,
  Json, Router,
};

use crate::models::{self, SharedState};

pub fn service_routes(state: models::SharedState) -> Router<()> {
  Router::new()
    .route("/admin/:serv_name", get(get_service_info))
    .route("/user", get(get_service_info))
    .with_state(state)
}

#[axum_macros::debug_handler]
async fn get_service_info(
  State(state): State<SharedState>,
  Path(serv_name): Path<String>,
) -> impl IntoResponse {
  let x = state.read().await.services.clone();

  println!("{:?}", serv_name);

  if let Some(val) = x.get(&serv_name) {
    Ok(Json(val.clone()))
  } else {
    Err(StatusCode::NOT_FOUND)
  }
}

// async fn add_service() -> &'static str {
//   // x.insert(
//   //   "hi".to_string(),
//   //   Service {
//   //     api: "hi".to_string(),
//   //     description: "hi".to_string(),
//   //     user: "lol".to_string(),
//   //   },
//   // );
//   "Add service"
// }

// async fn delete_service() -> &'static str {
//   "Delete service"
// }

// async fn update_service() -> &'static str {
//   "Update service"
// }
