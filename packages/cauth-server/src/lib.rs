// Initial Messy Code™
pub mod routes;

use axum::Router;
use std::net::SocketAddr;

pub struct AdminOpts {
    pub access_key: String,
}

pub struct Server {
    pub addr: SocketAddr,
    pub router: Router,
    // pub middleware: Option<ServiceBuilder<>>,
    // pub admin: AdminOpts,
}

impl Default for Server {
    fn default() -> Self {
        Self {
            addr: SocketAddr::from(([127, 0, 0, 1], 3000)),
            router: Router::new().nest("/", routes::echo::routes()),
        }
    }
}

impl Server {
    // pub fn add_middleware(&mut self, middleware: Box<dyn Middleware>) {
    //     self.middleware.insert(middleware);
    //     self
    // }

    pub async fn run(self) {
        let app = self.router;

        axum::Server::bind(&self.addr)
            .serve(app.into_make_service())
            .await
            .unwrap();
    }
}
