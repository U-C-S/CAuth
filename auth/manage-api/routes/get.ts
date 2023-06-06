import { FastifyInstance } from "fastify";
import { SResponse } from "../types/IQuery";
import { app_table, service_table } from "@prisma/client";
import { jwtUserPayload } from "../types/jwt";

enum EntityType {
  SERVICE = "service",
  APP = "app",
}

interface IGetItem {
  Reply: SResponse<service_table | app_table>;
  Params: {
    etype: string;
    ename: string;
  };
}

export async function getRoutes(fastify: FastifyInstance) {
  let { prisma } = fastify;

  fastify.get<IGetItem>("/:etype/:ename", async (request, reply) => {
    const { etype, ename } = request.params;

    if (etype === EntityType.SERVICE) {
      let x = await prisma.service_table.findUnique({
        where: {
          service_name: ename,
        },
      });

      if (!x) {
        return reply.status(404).send({
          success: false,
          message: `Service "${ename}" not found`,
        });
      }

      return reply.send({
        success: true,
        data: x,
      });
    } else if (etype === EntityType.APP) {
      let x = await prisma.app_table.findUnique({
        where: {
          app_name: ename,
        },
      });

      if (!x) {
        return reply.status(404).send({
          success: false,
          message: `App "${ename}" not found`,
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
}
