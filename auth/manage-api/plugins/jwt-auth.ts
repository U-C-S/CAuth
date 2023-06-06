import fastifyJwt from "@fastify/jwt";
import { FastifyPluginAsync, FastifyReply, FastifyRequest, onRequestAsyncHookHandler } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: onRequestAsyncHookHandler;
	}
}

const jwtPlugin: FastifyPluginAsync = fp(async fastify => {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

	fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});
});

export default jwtPlugin;
