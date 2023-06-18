import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { RequestInfo, RequestInit } from "node-fetch";

const fetch = (...args: [URL | RequestInfo]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

interface IEapToken {
  user_id: number;
  scope: string; // seperated by spaces
  appid: number;
}

export async function infoRoutes(fastify: FastifyInstance) {
  fastify.post("/eaquerydata", async (request, reply) => {
    let { eaptoken } = request.body as any;

    let decoded = jwt.verify(eaptoken, "supersecret") as IEapToken;

    if (!decoded) {
      return reply.status(403).send({
        success: false,
        message: "Invalid token",
      });
    }

    let x = await fastify.prisma.app_data_access_info.findFirst({
      where: {
        AND: [
          {
            user_id: {
              equals: decoded.user_id,
            },
          },
          {
            app_id: {
              equals: decoded.appid,
            },
          },
        ],
      },
    });

    if (!x) {
      return reply.status(403).send({
        success: false,
        message: "Invalid token",
      });
    }

    let data = await fastify.prisma.app_data_access_info.findMany({
      where: {
        app_id: {
          equals: decoded.appid,
        },
      },
    });

    reply.send({
      success: true,
      data,
    });
  });

  fastify.post(
    "/accesstokengenerate",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      let { scope, appid } = request.body as any;
      let user_id = request.user.id;

      if (!user_id) {
        return reply.status(403).send({
          success: false,
          message: "Invalid user token",
        });
      }

      let x = await fastify.prisma.app_data_access_info.create({
        data: {
          user_id,
          scope,
          app_id: appid,
        },
      });

      let eaptoken = jwt.sign(
        {
          internal_id: x.id,
          user_id,
          scope,
          appid,
        },
        "supersecret",
        {
          expiresIn: "7d",
        }
      );

      reply.send({ eaptoken });
    }
  );

  fastify.post("/checkappaccess", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let { appid } = request.body as any;
    let user_id = request.user.id;

    let x = await fastify.prisma.app_data_access_info.findFirst({
      where: {
        AND: [
          {
            user_id: {
              equals: user_id,
            },
          },
          {
            app_id: {
              equals: appid,
            },
          },
        ],
      },
      select: {
        id: true,
        scope: true,
        user_info: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!x) {
      // TODO: fetch app data from central server and send it to the client
      let app_data_req = await fetch("http://localhost:3000/manage/get/app/" + appid);
      let app_data_json = await app_data_req.json();
      console.log(app_data_json);
      return reply.status(200).send({
        success: false,
        app_data: app_data_json,
      });
    } else {
      let eaptoken = jwt.sign(
        {
          internal_id: x.id,
          user_id,
          scope: x.scope,
          appid,
        },
        "supersecret",
        {
          expiresIn: "7d",
        }
      );

      return reply.send({
        success: true,
        eaptoken,
      });
    }
  });

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
      },
    });

    let token = fastify.jwt.sign({ id: newUser.id, email: newUser.email });

    reply.send({ token });
  });
}
