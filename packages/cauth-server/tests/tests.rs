use cauth_server::Server;
use std::net::SocketAddr;

// fn setup_server() {}

#[tokio::test]
async fn it_works() {
    tokio::spawn(async move {
        let x: Server = Server::default();
        x.run().await;
    });

    let y = reqwest::get("http://127.0.0.1:3000/echo").await.unwrap();
    // assert_eq!(y.status(), 200);
    let yx = &y.text().await.unwrap();
    // println!("{:?}", &yx);
    assert_eq!(yx, "echo");
}

#[tokio::test]
async fn it_works2() {
    tokio::spawn(async move {
        let x = Server {
            addr: SocketAddr::from(([127, 0, 0, 1], 3001)),
            ..Default::default()
        };
        x.run().await;
    });

    let stringy = String::from("meowmeow");
    let client = reqwest::Client::new();
    let res = client
        .post("http://127.0.0.1:3001/echo")
        .body(stringy.clone())
        .send()
        .await
        .unwrap();

    let resbody = res.text().await.unwrap();
    // println!("{:?}", &resbody);
    assert_eq!(resbody, stringy);
}
