use std::{collections::HashMap, sync::Arc};

use tokio::sync::RwLock;

#[derive(Debug)]
pub struct Service {
  pub description: String,
  // version: String,
  pub api: String,
  pub user: String,
}

#[derive(Debug)]
pub struct User {
  pub name: String,
  pub email: String,
  pub password: String,
}

#[derive(Debug)]
pub struct State {
  pub services: HashMap<String, Service>,
  pub users: HashMap<String, User>,
}

pub type SharedState = Arc<RwLock<State>>;
