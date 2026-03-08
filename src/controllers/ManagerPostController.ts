import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { ManagerPostBody } from "../schemas/manager.schemas";
import { ManagerCreator } from "../context/manager/application/ManagerCreator";
import { MANAGER_REPO_TOKEN } from "../context/manager/infrastructure/PostgreSQLManagerRepository";
import { ManagerRepository } from "../context/manager/domain/ManagerRepository";

@injectable()
export class ManagerPostController {
  private managerCreator: ManagerCreator;
  constructor(
    @inject(MANAGER_REPO_TOKEN) private managerRepository: ManagerRepository,
  ) {
    this.managerCreator = new ManagerCreator(this.managerRepository);
  }

  async run(
    request: FastifyRequest<{ Body: ManagerPostBody }>,
    reply: FastifyReply,
  ) {
    const { id, name, email } = request.body;
    await this.managerCreator.run(id, name, email);
    reply.code(201).send();
  }
}
