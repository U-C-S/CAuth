import { FastifyInstance } from "fastify";
import { SResponse } from "../types/IQuery";

export async function createRoutes(fastify: FastifyInstance) {
  fastify.post("/service", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const data = request.body as any;
    console.log("-------------------------------------------------" + data.service_name);

    let x = await fastify.prisma.service_table.create({
      data: {
        service_name: data.service_name,
        description: data?.description,
        api_base_uri: data?.api_base_uri,
        Provider: {
          connect: {
            user_name: request.user.user_name,
          },
        },
      },
      select: {
        id: true,
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

  fastify.post<{
    Reply: SResponse<any>;
  }>("/app", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const data = request.body as any;

    let x = await fastify.prisma.app_table.create({
      data: {
        app_name: data.app_name,
        description: data.description,
        Owner: {
          connect: {
            user_name: request.user.user_name,
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
  });

  fastify.delete<{
    Params: {
      id: string;
    };
  }>("/service/:id", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    let x = await fastify.prisma.service_table.delete({
      where: {
        id: parseInt(id),
      },
    });

    return reply.send({
      success: true,
      data: x,
    });
  });

  fastify.post(
    "/link/:app/:service",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { service, app } = request.params as any;

      // TODO: check if service and app belongs to the user
      let x = await fastify.prisma.services_used_by_apps.create({
        data: {
          App: {
            connect: {
              id: parseInt(app),
            },
          },
          Service: {
            connect: {
              id: parseInt(service),
            },
          },
          config: JSON.stringify(request.body),
        },
        select: {
          id: true,
          config: true,
          App: {
            select: {
              app_name: true,
              id: true,
            },
          },
          Service: {
            select: {
              service_name: true,
              id: true,
              api_base_uri: true,
              Provider: {
                select: {
                  user_name: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: x,
      });
    }
  );
}
