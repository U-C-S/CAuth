// pub fn create_redis_instance() {
//   todo!("create_redis_instance")
// }

use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

pub type PgPoolType = Pool<Postgres>;

pub async fn create_postgres_instance(db_url: &str) -> Result<Pool<Postgres>, sqlx::Error> {
  let pool = PgPoolOptions::new()
    .max_connections(3)
    .connect(db_url)
    .await
    .expect("Failed to connect to Postgres");

  Ok(pool)
}
