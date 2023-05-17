pub mod token;

use serde::{Deserialize, Serialize};

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
  // pub max_token_expire_time: u64,
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

// #[derive(Debug, Deserialize, Serialize)]
pub enum EntityType {
  Application, //can only access other services aka. Client
  Service,     //can only provide services
}
