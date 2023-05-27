import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt-auth";
export default async function appFactory(fastify: FastifyInstance) {
	const app = fastify;

	app.register(jwtPlugin);
	app.register(prismaPlugin);
	app.register(fastifyCors, {
		methods: ["GET", "POST", "PUT", "DELETE"],
		origin: "*",
	});

	return app;
}
export function buildFastifyServer(opts: FastifyServerOptions = {}): FastifyInstance {
	const app = fastify(opts);
	app.register(appFactory);
	return app;
}
