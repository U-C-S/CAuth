use axum::{routing::get, Router};
use std::net::SocketAddr;

pub struct AdminOpts {
    pub access_key: String,
}

pub struct Middleware {}

pub struct Server {
    pub addr: SocketAddr,
    //pub middleware: Option<Vec<Box<dyn Middleware>>>,
    // pub admin: AdminOpts,
}

impl Default for Server {
    fn default() -> Self {
        Self {
            addr: SocketAddr::from(([127, 0, 0, 1], 3000)),
            // middleware: None,
            // admin: AdminOpts {
            //     access_key: "admin".to_string(),
            // },
        }
    }
}

impl Server {
    pub fn new(addr: SocketAddr) -> Self {
        Self {
            addr,
            // middleware: None,
            // admin: todo!(),
        }
    }

    // pub fn add_middleware(&mut self, middleware: Box<dyn Middleware>) {
    //     self.middleware.insert(middleware);
    //     self
    // }

    pub async fn run(self) {
        let app = Router::new().route(
            "/echo",
            get(|| async { "echo" }).post(|body: String| async { body }),
        );
        // .nest("/", todo!());

        axum::Server::bind(&self.addr)
            .serve(app.into_make_service())
            .await
            .unwrap();
    }
}
