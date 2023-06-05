import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt-auth";
import { authRoutes } from "./routes/auth";
import { miscRoutes } from "./routes/misc";
import { getRoutes } from "./routes/get";
import { createRoutes } from "./routes/create";

export default async function appFactory(fastify: FastifyInstance) {
  const app = fastify;

  app.register(jwtPlugin);
  app.register(prismaPlugin);
  app.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  });

  app.register(authRoutes, { prefix: "/auth" });
  app.register(getRoutes, { prefix: "/manage/get" });
  app.register(createRoutes, { prefix: "/manage/create"})
  app.register(miscRoutes, { prefix: "/" });

  return app;
}
export function buildFastifyServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify(opts);
  app.register(appFactory);
  return app;
}
