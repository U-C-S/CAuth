import { FastifyInstance } from "fastify";

export async function infoRoutes(fastify: FastifyInstance) {
  fastify.post("/info", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let body = request.body as any;

    try {
      let x = await fastify.prisma.user_info.update({
        where: {
          email: request.user.email,
        },
        data: {
          ...body,
        },
      });

      reply.send(x);
    } catch (err) {
      reply.status(500).send(err);
    }
  });

  fastify.get("/info", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let x = await fastify.prisma.user_info.findUnique({
      where: {
        email: request.user.email,
      },
    });

    reply.send(x);
  });

  fastify.post("/auth/login", async (request, reply) => {
    let body = request.body as any;

    let user = await fastify.prisma.user_info.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      reply.status(404).send("User not found");
      return;
    }

    if (user.password !== body.password) {
      reply.status(403).send("Invalid password");
      return;
    }

    let token = fastify.jwt.sign({ id: user.id, email: user.email });

    reply.send({ token });
  });

  fastify.post("/auth/register", async (request, reply) => {
    let body = request.body as any;

    let user = await fastify.prisma.user_info.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) {
      reply.status(409).send("User already exists");
      return;
    }

    let newUser = await fastify.prisma.user_info.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
        ...body,
      },
    });

    let token = fastify.jwt.sign({ id: newUser.id, email: newUser.email });

    reply.send({ token });
  });
}
