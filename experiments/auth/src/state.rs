use std::{collections::HashMap, sync::Arc};

use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::models::*;

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  pub clients: HashMap<String, IClient>,
  pub services: HashMap<String, Service>,
  pub users: HashMap<String, User>,
}

pub type SharedState = Arc<RwLock<State>>;

pub fn shared_state() -> SharedState {
  let init_state = State {
    services: HashMap::from([
      (
        "TimeService".to_string(),
        Service {
          api: "TimeSerivce".to_string(),
          description: Some("TimeSerivce".to_string()),
          user: "ucs".to_string(),
        },
      ),
      (
        "WeatherService".to_string(),
        Service {
          api: "http://localhost:4200/WeatherApp".to_string(),
          description: None,
          user: "ucs".to_string(),
        },
      ),
    ]),
    users: HashMap::from([(
      "ucs".to_string(),
      User {
        email: "ucs@email.com".to_string(),
        password: "password".to_string(),
      },
    )]),
    clients: HashMap::from([(
      "WeatherApp".to_string(),
      IClient {
        description: Some("WeatherApp that uses weather service api".to_string()),
        services_access: vec!["WeatherService".to_string()],
        owner: "ucs".to_string(),
      },
    )]),
  };

  Arc::new(RwLock::new(init_state))
}
