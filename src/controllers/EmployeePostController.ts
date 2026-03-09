import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { EmployeePostBody } from "../schemas/employee.schemas";
import { EmployeeCreator } from "../context/employee/application/EmployeeCreator";
import { EMPLOYEE_REPO_TOKEN } from "../context/employee/infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeRepository } from "../context/employee/domain/EmployeeRepository";
import { MANAGER_REPO_TOKEN } from "../context/manager/infrastructure/PostgreSQLManagerRepository";
import { EmployeeManagerNotFoundError } from "../context/employee/domain/EmployeeManagerNotFoundError";
@injectable()
export class EmployeePostController {
  private employeeCreator: EmployeeCreator;
  constructor(
    @inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository,
    @inject(MANAGER_REPO_TOKEN) private managerRepository: EmployeeRepository,
  ) {
    this.employeeCreator = new EmployeeCreator(
      this.employeeRepository,
      this.managerRepository,
    );
  }
  async run(
    request: FastifyRequest<{ Body: EmployeePostBody }>,
    reply: FastifyReply,
  ) {
    const { body } = request;
    const { name, email, id, managerId } = body;
    try {
      await this.employeeCreator.run(id, name, email, managerId);
      reply.code(201).send();
    } catch (error) {
      if (error instanceof EmployeeManagerNotFoundError) {
        reply.code(404).send({ message: error.message });
      } else {
        reply.code(500).send({ message: "Internal Server Error" });
      }
    }
  }
}
