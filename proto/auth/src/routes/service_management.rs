use axum::{
  extract::{Path, State},
  http::StatusCode,
  response::IntoResponse,
  routing::{get, post},
  Json, Router,
};

use crate::models::{self, Service, SharedState};

pub fn service_routes(state: models::SharedState) -> Router<()> {
  Router::new()
    .route("/get/:serv_name", get(get_service_info))
    .route("/add", post(add_service))
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

#[derive(serde::Deserialize)]
struct ServiceReq {
  name: String,
  api: String,
  description: String,
  user: String,
}

#[derive(serde::Serialize)]
struct GenericResponse {
  status: String,
  message: String,
}

#[axum_macros::debug_handler]
async fn add_service(
  State(state): State<SharedState>,
  Json(payload): Json<ServiceReq>,
) -> impl IntoResponse {
  let services = &mut state.write().await.services;

  let ins = services.insert(
    payload.name,
    Service {
      api: payload.api,
      description: payload.description,
      user: payload.user,
    },
  );

  if ins.is_none() {
    Ok(Json(GenericResponse {
      status: "success".to_string(),
      message: "Service added".to_string(),
    }))
  } else {
    Err(StatusCode::BAD_REQUEST)
  }
}

// async fn delete_service() -> &'static str {
//   "Delete service"
// }

// async fn update_service() -> &'static str {
//   "Update service"
// }
