import { FastifyInstance } from "fastify";

export async function miscRoutes(fastify: FastifyInstance) {
	fastify.all("/check", async (request, reply) => {
		return reply.send({
			success: true,
			message: "The API is running",
		});
	});

	fastify.all("/fail", async (request, reply) => {
		return reply.send({
			success: false,
			message: "Sent a failure message",
			data: request.body,
		});
	});
}
