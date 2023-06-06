import "@fastify/jwt";

export type jwtUserPayload = {
  id: number;
  user_name: string;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: jwtUserPayload;
    user: jwtUserPayload;
  }
}
