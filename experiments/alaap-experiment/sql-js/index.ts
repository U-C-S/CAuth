import uWS from 'uWebSockets.js';

const port = 1337;

type RpcCommand<T> = {
    uuid: number,
    command_id: number,
    args: T
};

const process_lookup = {
    1: process_TestCommand
}

uWS.App().ws('/*', {
    open: (ws) => {
        console.log(`Client connected!`);
    },
    message: (ws, message, isBinary) => {
        if (isBinary) {
            console.error('Bad data recieved from RpcClient');
            return;
        }
        let text_decoder = new TextDecoder('utf-8')
        let string_message = text_decoder.decode(message);
        console.log(`Message recv[string]: ${string_message}`);

        let json_res = JSON.parse(string_message);
        process_lookup[json_res["command_id"] as keyof typeof process_lookup](ws, json_res);

    },
    close: (ws) => {
        console.log(`Client disconnected!`);
    }
}).listen(port, (token) => {
    if (token) {
        console.log(`Listening on port ${port}`);
    } else {
        console.log(`Failed to listen on port: ${port}`);
    }
});

type TestCommand = RpcCommand<number>;

function process_TestCommand(ws: uWS.WebSocket<unknown>, test_command: TestCommand) {
    console.log(test_command);
    ws.send(JSON.stringify({
        'arg_recv': test_command.args
    }));
}
