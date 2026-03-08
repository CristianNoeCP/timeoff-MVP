import { FastifyInstance } from "fastify";
import { globSync } from "glob";

export function registerRoutes(fastify: FastifyInstance) {
  const routes = globSync(__dirname + "/**/*.route.*");
  console.log("Registering routes from files:", routes);
  routes.map((route) => register(route, fastify));
}

function register(routePath: string, fastify: FastifyInstance) {
  const routeModule = require(routePath);
  const routeFn = routeModule.default || routeModule;
  if (typeof routeFn === "function") {
    routeFn(fastify);
  } else {
    console.error(
      `Error: the module at ${routePath} does not export a default function.`
    );
  }
}
