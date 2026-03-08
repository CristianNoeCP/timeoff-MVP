import "reflect-metadata";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import {
  EmployeeDetail,
  EmployeeDetailSchema,
  EmployeeParams,
  EmployeeParamsSchema,
  EmployeePostBody,
  EmployeePostBodySchema,
  ErrorEmployeeResponse,
  ErrorEmployeeSchema,
} from "../schemas/employee.schemas";
import { EmployeePostController } from "../controllers/EmployeePostController";
import { EmployeeGetController } from "../controllers/EmployeeGetController";

export default function employeeRoutes(fastify: FastifyInstance) {
  fastify.route({
    url: "/employees",
    method: "POST",
    schema: {
      description: "Create a new employee",
      tags: ["Employees"],
      body: EmployeePostBodySchema,
      response: {
        201: {},
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: EmployeePostBody }>,
      reply: FastifyReply,
    ) => {
      const employeeController = container.resolve(EmployeePostController);
      await employeeController.run(request, reply);
    },
  });
  fastify.get<{
    Params: EmployeeParams;
    Reply: EmployeeDetail | ErrorEmployeeResponse;
  }>("/employees/:id", {
    schema: {
      description: "Get employee by ID",
      tags: ["Employees"],
      params: EmployeeParamsSchema,
      response: {
        200: EmployeeDetailSchema,
        404: ErrorEmployeeSchema,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: EmployeeParams }>,
      reply: FastifyReply,
    ) => {
      const employeeController = container.resolve(EmployeeGetController);
      await employeeController.run(request, reply);
    },
  });
}
