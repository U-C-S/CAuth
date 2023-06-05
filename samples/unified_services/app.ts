import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt-auth";
import { infoRoutes } from "./routes/info.routes";

export default async function appFactory(fastify: FastifyInstance) {
  const app = fastify;

  app.register(jwtPlugin);
  app.register(prismaPlugin);
  app.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  });

  app.register(infoRoutes, { prefix: "/info" });

  return app;
}
export function buildFastifyServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify(opts);
  app.register(appFactory);
  return app;
}

let x = await fetch(
  "https://api.openweathermap.org/data/2.5/weather?q=London&appid=8f9b9b0b0b0b0b0b0b0b0b0b0b0b0b0b"
);
