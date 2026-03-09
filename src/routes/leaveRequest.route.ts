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
  LeaveRequestManagerSchema,
  LeaveRequestManagerPatchBody,
} from "../schemas/leave_request.schemas";
import { LeaveRequestPostController } from "../controllers/LeaveRequestPostController";
import { LeaveRequestGetController } from "../controllers/LeaveRequestGetController";
import { LeaveRequestPatchController } from "../controllers/LeaveRequestPatchController";

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
  fastify.patch<{
    Params: LeaveRequestParams;
    Body: LeaveRequestManagerPatchBody;
  }>("/leave-requests/:id/approve", {
    schema: {
      description: "Approve a leave request",
      tags: ["Leave Requests"],
      params: LeaveRequestParamsSchema,
      body: LeaveRequestManagerSchema,
      response: {
        201: {},
        404: ErrorLeaveRequestSchema,
        409: ErrorLeaveRequestSchema,
        403: ErrorLeaveRequestSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = container.resolve(LeaveRequestPatchController);
      await controller.run(request, reply);
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
