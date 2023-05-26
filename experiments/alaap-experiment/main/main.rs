use anyhow::{anyhow, Ok, Result};
use axum::{response::Html, routing::get, Router};
use futures_util::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt,
};
use serde::Serialize;
use std::{future::IntoFuture, net::SocketAddr, time::Duration};
use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async, tungstenite::protocol::Message, MaybeTlsStream, WebSocketStream,
};

// Websocket memes
struct WsConnection {
    conn_addr: String,
    ws_read_stream: SplitStream<WebSocketStream<MaybeTlsStream<TcpStream>>>,
    ws_write_stream: SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>,
}

impl WsConnection {
    pub async fn new(conn_addr: &str) -> Result<WsConnection> {
        let (ws_stream, _) = connect_async(conn_addr).await?;
        println!("WebSocket handshake has been successfully completed");

        let (write, read) = ws_stream.split();

        return Ok(WsConnection {
            conn_addr: conn_addr.to_string(),
            ws_read_stream: read,
            ws_write_stream: write,
        });
    }

    pub async fn write(&mut self, msg: &str) -> Result<(), tokio_tungstenite::tungstenite::Error> {
        return self
            .ws_write_stream
            .send(Message::Text(msg.to_string()))
            .await;
    }

    pub async fn read(&mut self) -> Result<String> {
        let err = anyhow!("Bad message recieved from the server");

        if let Some(next_msg) = self.ws_read_stream.next().into_future().await {
            match next_msg? {
                Message::Text(msg) => Ok(msg),
                _ => Err(err),
            }
        } else {
            return Err(err);
        }
    }
}


// Rpc Protocol memes
struct RpcConnection {
    conn: WsConnection
}

#[derive(Serialize)]
struct RpcCommand<Arg> {
    uuid: i32,
    command_id: i32,
    arg: Arg
}


impl RpcConnection {
    async fn new(conn_addr: &str) -> Result<RpcConnection> {
        let conn = WsConnection::new(conn_addr).await?;
        
        Ok(RpcConnection { conn })
    }

    async fn run_command<Arg>(&mut self, command: RpcCommand<Arg>) -> Result<serde_json::Value>
        where Arg: Serialize {
        let json_to_send = serde_json::to_string(&command)?;
        self.conn.write(&json_to_send).await?;

        let response = self.conn.read().await?;
        let response: serde_json::Value = serde_json::from_str::<_>(response.as_str())?;

        Ok(response)
    }
}

async fn websocket_start() -> Result<()> {
    let connect_addr = "ws://localhost:1337";
    
    let mut rpc = RpcConnection::new(connect_addr).await?;
    let resp = rpc.run_command(RpcCommand { uuid: 1, command_id: 1, arg: 1 }).await?;
    println!("{}", resp.to_string());

    Ok(())
}

#[tokio::main]
async fn main() {
    tokio::spawn(websocket_start());

    // build our application with a route
    let app = Router::new().route("/", get(handler));

    // run it
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}
