use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use tokio_postgres::NoTls;

pub fn create_redis_instance() {
  todo!("create_redis_instance")
}

pub type PgSqlPool = Pool<PostgresConnectionManager<NoTls>>;

pub async fn create_postgres_instance() -> PgSqlPool {
  let manager =
    PostgresConnectionManager::new_from_stringlike("host=localhost user=postgres", NoTls).unwrap();
  let pool = Pool::builder().build(manager).await.unwrap();

  pool
}
