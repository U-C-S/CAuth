use std::net::SocketAddr;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

pub struct AdminOpts {
    pub access_key: String,
}

pub struct Server {
    pub addr: SocketAddr,
    pub middleware: Option<Vec<Box<dyn Middleware>>>,
    pub admin: AdminOpts,
}

impl Server {
    pub fn new(addr: SocketAddr) -> Self {
        Self {
            addr,
            middleware: None,
            admin: todo!(),
        }
    }

    pub fn add_middleware(&mut self, middleware: Box<dyn Middleware>) {
        self.middleware.insert(middleware);
        self
    }

    pub async fn run(self) {
        let app = Router::new().nest("/", todo!());

        axum::Server::bind(&self.addr)
            .serve(app.into_make_service())
            .await
            .unwrap();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
