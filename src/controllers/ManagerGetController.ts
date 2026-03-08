import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { MANAGER_REPO_TOKEN } from "../context/manager/infrastructure/PostgreSQLManagerRepository";
import { ManagerRepository } from "../context/manager/domain/ManagerRepository";
import { ManagerFinder } from "../context/manager/application/ManagerFinder";
import { ManagerNotFoundError } from "../context/manager/domain/ManagerNotFoundError";

@injectable()
export class ManagerGetController {
  private managerFinder: ManagerFinder;
  constructor(
    @inject(MANAGER_REPO_TOKEN) private managerRepository: ManagerRepository,
  ) {
    this.managerFinder = new ManagerFinder(this.managerRepository);
  }

  async run(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    try {
      const manager = await this.managerFinder.run(id);
      reply.code(200).send(manager);
    } catch (error) {
      if (error instanceof ManagerNotFoundError) {
        reply.code(404).send({ error: error.name, message: error.message });
      } else {
        reply.code(500).send({
          error: "InternalServerError",
          message: "An unexpected error occurred",
        });
      }
    }
  }
}
