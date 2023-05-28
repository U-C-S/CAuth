import { FastifyInstance } from "fastify";
import { SResponse } from "../types/IQuery";
import { AppTable, ServiceTable } from "@prisma/client";

enum EntityType {
  SERVICE = "service",
  APP = "app",
}

interface IGetItem {
  Reply: SResponse<ServiceTable | AppTable>;
  Params: {
    etype: string;
    ename: string;
  };
}

export async function getRoutes(fastify: FastifyInstance) {
  let { prisma } = fastify;

  fastify.get<IGetItem>("/get/:etype/:ename", async (request, reply) => {
    const { etype, ename } = request.params;

    if (etype === EntityType.SERVICE) {
      let x = await prisma.serviceTable.findUnique({
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
      let x = await prisma.appTable.findUnique({
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
    "/get/all_owned_services",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      let x = await prisma.serviceTable.findMany({
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

  fastify.get(
    "/get/all_owned_apps",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      let x = await prisma.appTable.findMany({
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
    }
  );

  fastify.get("/get/all_public_services", async (request, reply) => {
    let x = await prisma.serviceTable.findMany({
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

  fastify.get("/add/:etype", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { etype } = request.params;
    const { user_name } = request.user;
    const data = request.body as any;

    if (etype === EntityType.SERVICE) {
      let x = await prisma.serviceTable.create({
        data: {
          service_name: data.service_name,
          description: data.description,
          api_base_uri: data.api_base_uri,
          Provider: {
            connect: {
              user_name,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          service_name: x.service_name,
          service_id: x.id,
        },
      });
    } else if (etype === EntityType.APP) {
      let x = await prisma.appTable.create({
        data: {
          app_name: data.app_name,
          description: data.description,
          Owner: {
            connect: {
              user_name,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          app_name: x.app_name,
          app_id: x.id,
        },
      });
    }
  });
}
