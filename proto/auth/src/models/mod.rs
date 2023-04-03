use std::{collections::HashMap, sync::Arc};

use tokio::sync::RwLock;

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct Service {
  pub description: String,
  // version: String,
  pub api: String,
  pub user: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct User {
  pub email: String,
  pub password: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct State {
  pub services: HashMap<String, Service>,
  pub users: HashMap<String, User>,
}

pub type SharedState = Arc<RwLock<State>>;

pub fn shared_state() -> State {
  State {
    services: HashMap::from([(
      "TimeService".to_string(),
      Service {
        api: "TimeSerivce".to_string(),
        description: "TimeSerivce".to_string(),
        user: "lol".to_string(),
      },
    )]),
    users: HashMap::from([(
      "ucs".to_string(),
      User {
        email: "ucs@email.com".to_string(),
        password: "password".to_string(),
      },
    )]),
  }
}
