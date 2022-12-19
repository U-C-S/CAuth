use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};

async fn index() -> HttpResponse {
    HttpResponse::Ok().body("Hello")
}

#[get("/echo")]
async fn echo() -> impl Responder {
    HttpResponse::Ok().body("Echo")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(echo)
            .route("/", web::get().to(index))
            .route("/user", web::post().to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
