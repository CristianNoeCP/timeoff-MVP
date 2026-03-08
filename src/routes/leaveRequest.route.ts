import "reflect-metadata";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { container } from "tsyringe";
import {
  LeaveRequestPostBodySchema,
  LeaveRequestPostBody,
  LeaveRequestParams,
  ErrorLeaveRequestResponse,
  LeaveRequestDetail,
  ErrorLeaveRequestSchema,
  LeaveRequestParamsSchema,
  LeaveRequestDetailSchema,
} from "../schemas/leave_request.schemas";
import { LeaveRequestPostController } from "../controllers/LeaveRequestPostController";
import { LeaveRequestGetController } from "../controllers/LeaveRequestGetController";

export default function leaveRequestRoutes(fastify: FastifyInstance) {
  fastify.route({
    url: "/leave-requests",
    method: "POST",
    schema: {
      description: "Create a new leave request",
      tags: ["Leave Requests"],
      body: LeaveRequestPostBodySchema,
      response: {
        201: {},
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: LeaveRequestPostBody }>,
      reply: FastifyReply,
    ) => {
      const leaveRequestController = container.resolve(
        LeaveRequestPostController,
      );
      await leaveRequestController.run(request, reply);
    },
  });
  fastify.get<{
    Params: LeaveRequestParams;
    Reply: LeaveRequestDetail | ErrorLeaveRequestResponse;
  }>("/leave-requests/:id", {
    schema: {
      description: "Get leave request by ID",
      tags: ["Leave Requests"],
      params: LeaveRequestParamsSchema,
      response: {
        200: LeaveRequestDetailSchema,
        404: ErrorLeaveRequestSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: LeaveRequestParams }>,
      reply: FastifyReply,
    ) => {
      const leaveRequestGetController = container.resolve(
        LeaveRequestGetController,
      );
      await leaveRequestGetController.run(request, reply);
    },
  });
}
