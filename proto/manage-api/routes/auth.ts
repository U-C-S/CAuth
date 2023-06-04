import { FastifyInstance } from "fastify";
import bcrypt from "@node-rs/bcrypt";

import { checkUserPassword, createProfile, getProfile } from "../services/profileServices";

export async function authRoutes(fastify: FastifyInstance) {
  let { prisma } = fastify;

  fastify.post("/login", async (request, reply) => {
    const { user_name, password } = request.body as any;

    let result = await checkUserPassword(user_name, password);
    // fastify.log.info(result);
    if (result.success) {
      return reply.send({
        success: true,
        data: {
          token: await reply.jwtSign({
            id: result?.data?.id as number,
            user_name: user_name,
          }),
          user_name,
        },
      });
    }

    return reply.code(403).send(result);
  });

  fastify.post("/register", async (request, reply) => {
    const { user_name, password, email } = request.body as any;

    let hashedpassword = await bcrypt.hash(password, 10);
    let profile = await createProfile({ user_name, password: hashedpassword, email });

    if (profile.success) {
      return reply.send({
        success: true,
        message: "Success",
        data: {
          token: await reply.jwtSign({
            id: profile.data?.id as number,
            user_name: user_name,
          }),
          user_name,
        },
      });
    }
    return reply.code(500).send({
      success: false,
      message: profile.message,
    });
  });

  fastify.get("/whoami", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let profile = await getProfile(request.user.user_name);
    if (profile.success) {
      return reply.send({
        success: true,
        data: profile.data,
      });
    }
    return reply.code(500).send({
      success: false,
      message: profile.message,
    });
  });
}
