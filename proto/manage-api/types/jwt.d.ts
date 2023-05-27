import "@fastify/jwt";

export type jwtUserPayload = {
	id: number;
	username: string;
};

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: jwtUserPayload;
		user: jwtUserPayload;
	}
}
