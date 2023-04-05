pub mod token;

use std::{collections::HashMap, sync::Arc};

use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct IClient {
  // pub name: String,
  pub description: Option<String>,
  pub services_access: Vec<String>, //foriegn key to services
  pub owner: String,                //foriegn key to owner user
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Service {
  // pub name: String,
  pub description: Option<String>,
  pub api: String,  // API access endpoint URL
  pub user: String, //foriegn key to owner user
}

#[derive(Debug, Deserialize, Serialize)]
pub struct User {
  // pub name: String,
  pub email: String,
  pub password: String,
}

// pub struct Username(String);

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  pub clients: HashMap<String, IClient>,
  pub services: HashMap<String, Service>,
  pub users: HashMap<String, User>,
}

// #[derive(Debug, Deserialize, Serialize)]
pub enum EntityType {
  Application, //can only access other services aka. Client
  Service,     //can only provide services
}

pub type SharedState = Arc<RwLock<State>>;

pub fn shared_state() -> State {
  State {
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
  }
}
