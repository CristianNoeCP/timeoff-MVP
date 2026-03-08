import "dotenv/config";
import "reflect-metadata";
import "./context/shared/dependency-injection/tsyringe.config";
import Fastify, { FastifyServerOptions } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerRoutes } from "./routes";
import { container } from "tsyringe";
import { RabbitMqConsumer } from "./context/shared/infrastructure/events_bus/RabbitMqConsumer";
import {
  EmployeePostBodySchema,
  EmployeeDetailSchema,
  ErrorEmployeeSchema,
} from "./schemas/employee.schemas";
import {
  ErrorLeaveRequestSchema,
  LeaveRequestDetailSchema,
  LeaveRequestPostBodySchema,
} from "./schemas/leave_request.schemas";

const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
async function buildServer(opts: FastifyServerOptions = {}) {
  const fastify = Fastify({
    ...opts,
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();
  if (!isProduction) {
    await fastify.register(fastifySwagger, {
      openapi: {
        info: {
          title: "API Docs",
          description: "Documentación para DEV/STAGING",
          version: "1.0.0",
        },
        components: {
          schemas: {
            EmployeePostBody: EmployeePostBodySchema,
            EmployeeDetail: EmployeeDetailSchema,
            EmployeeError: ErrorEmployeeSchema,
            LeaveRequestPostBody: LeaveRequestPostBodySchema,
            LeaveRequestDetail: LeaveRequestDetailSchema,
            LeaveRequestError: ErrorLeaveRequestSchema,
          },
        },
      },
    });

    await fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });
  }
  await registerRoutes(fastify);
  return fastify;
}

async function start() {
  const server = await buildServer({});
  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.warn(
      `Server is running in mod: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`,
    );
    server.log.warn(`Listening on http://${HOST}:${PORT}`);
    if (!isProduction) {
      server.log.warn(`Documentation available at http://${HOST}:${PORT}/docs`);
    }

    const consumer = container.resolve(RabbitMqConsumer);
    consumer.start().catch((err) => {
      server.log.error(err, "Error starting RabbitMQ consumer");
    });
  } catch (err) {
    server.log.error(err, "Error starting server");
    process.exit(1);
  }
}

start();
