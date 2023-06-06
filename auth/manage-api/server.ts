import { FastifyServerOptions } from "fastify";
import { buildFastifyServer } from "./app";

let serverOpts: FastifyServerOptions = {
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				ignore: "pid, hostname",
				translateTime: "HH:MM:ss",
			},
		},
	},
};

// server
buildFastifyServer(serverOpts).listen({ port: parseInt(process.env.PORT || "3100") }, (err, address) => {
	if (err) {
		console.error(err);
	}
});
