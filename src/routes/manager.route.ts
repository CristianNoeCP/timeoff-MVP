import "reflect-metadata";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import {
  ManagerDetail,
  ManagerDetailSchema,
  ManagerParams,
  ManagerParamsSchema,
  ManagerPostBody,
  ManagerPostBodySchema,
  ErrorManagerResponse,
  ErrorManagerSchema,
} from "../schemas/manager.schemas";
import { ManagerPostController } from "../controllers/ManagerPostController";
import { ManagerGetController } from "../controllers/ManagerGetController";

export default function managerRoutes(fastify: FastifyInstance) {
  fastify.route({
    url: "/managers",
    method: "POST",
    schema: {
      description: "Create a new manager",
      tags: ["Managers"],
      body: ManagerPostBodySchema,
      response: {
        201: {},
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: ManagerPostBody }>,
      reply: FastifyReply,
    ) => {
      const managerController = container.resolve(ManagerPostController);
      await managerController.run(request, reply);
    },
  });

  fastify.get<{
    Params: ManagerParams;
    Reply: ManagerDetail | ErrorManagerResponse;
  }>("/managers/:id", {
    schema: {
      description: "Get manager by ID",
      tags: ["Managers"],
      params: ManagerParamsSchema,
      response: {
        200: ManagerDetailSchema,
        404: ErrorManagerSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: ManagerParams }>,
      reply: FastifyReply,
    ) => {
      const managerController = container.resolve(ManagerGetController);
      await managerController.run(request, reply);
    },
  });
}
