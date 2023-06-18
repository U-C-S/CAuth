import { FastifyInstance } from "fastify";
import { SResponse } from "../types/IQuery";
import { app_table, service_table } from "@prisma/client";
import { jwtUserPayload } from "../types/jwt";
import jsonwebtoken from "jsonwebtoken";

enum EntityType {
  SERVICE = "service",
  APP = "app",
}

interface IGetItem {
  Reply: SResponse<service_table | app_table>;
  Params: {
    etype: string;
    id: number;
  };
}

export async function getRoutes(fastify: FastifyInstance) {
  let { prisma } = fastify;

  fastify.get<IGetItem>("/:etype/:id", async (request, reply) => {
    const { etype, id } = request.params;

    if (etype === EntityType.SERVICE) {
      let x = await prisma.service_table.findUnique({
        where: { id },
      });

      if (!x) {
        return reply.status(404).send({
          success: false,
          message: `Service "${id}" not found`,
        });
      }

      return reply.send({
        success: true,
        data: x,
      });
    } else if (etype === EntityType.APP) {
      let x = await prisma.app_table.findUnique({
        where: { id },
      });

      if (!x) {
        return reply.status(404).send({
          success: false,
          message: `App "${id}" not found`,
        });
      }

      return reply.send({
        success: true,
        data: x,
      });
    } else {
      return {
        success: false,
        message: `Invalid entity type "${etype}" in URI`,
      };
    }
  });

  fastify.get(
    "/all_owned_services",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      let x = await prisma.service_table.findMany({
        where: {
          Provider: {
            user_name: request.user.user_name,
          },
        },
      });

      return reply.send({
        success: true,
        data: x,
      });
    }
  );

  fastify.get("/all_owned_apps", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let x = await prisma.app_table.findMany({
      where: {
        Owner: {
          user_name: request.user.user_name,
        },
      },
    });

    return reply.send({
      success: true,
      data: x,
    });
  });

  fastify.get("/all_public_services", async (request, reply) => {
    let x = await prisma.service_table.findMany({
      select: {
        service_name: true,
        description: true,
        api_base_uri: true,
        Provider: {
          select: {
            user_name: true,
            id: true,
          },
        },
      },
    });

    return reply.send({
      success: true,
      data: x,
    });
  });

  fastify.get(
    "/app_access_token",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      let user = request.user as jwtUserPayload;
      let { appid } = request.query as any;

      let x = await prisma.app_table.findUnique({
        where: {
          id: parseInt(appid),
        },

        select: {
          id: true,
          owner_id: true,
          ServicesUsedByApps: {
            select: {
              Service: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (x?.owner_id !== user.id) {
        return reply.status(403).send({
          success: false,
          message: "You are not the owner of this app",
        });
      }

      let token = jsonwebtoken.sign(
        {
          appid: x.id,
          services_accessing: x.ServicesUsedByApps.map((x) => x.Service.id),
        },
        "supersecret",
        { algorithm: "HS256", expiresIn: "60d" }
      );

      return reply.send({
        success: true,
        data: {
          token,
          issued_at: new Date(),
        },
      });
    }
  );
}
