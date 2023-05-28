mod add;
mod auth;
mod get;

use axum::{
  routing::{get, post},
  Router,
};

use crate::state::SharedState;

pub fn service_routes() -> Router<SharedState> {
  Router::new()
    .route("/get/:entity_type/:serv_name", get(get::get_service_info))
    .route("/get/all_owned_services", get(get::get_all_owned_services))
    .route("/get/all_owned_clients", get(get::get_all_owned_clients))
    .route("/get/all_services", get(get::get_all_services))
    .route("/add", post(add::add_service))
    .nest("/auth", auth::manage_auth_routes())
}
