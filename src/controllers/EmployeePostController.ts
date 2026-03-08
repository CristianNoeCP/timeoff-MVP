import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { EmployeePostBody } from "../schemas/employee.schemas";
import { EmployeeCreator } from "../context/employee/application/EmployeeCreator";
import { EMPLOYEE_REPO_TOKEN } from "../context/employee/infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeRepository } from "../context/employee/domain/EmployeeRepository";
@injectable()
export class EmployeePostController {
  private employeeCreator: EmployeeCreator;
  constructor(@inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository) {
    this.employeeCreator = new EmployeeCreator(this.employeeRepository);
  }
  async run(
    request: FastifyRequest<{ Body: EmployeePostBody }>,
    reply: FastifyReply
  ) {
    const { body } = request;
    const { name, email, id, managerId } = body;
    await this.employeeCreator.run(id, name, email, managerId);
    reply.code(201).send();
  }
}
