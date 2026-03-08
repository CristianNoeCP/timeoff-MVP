import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { EMPLOYEE_REPO_TOKEN } from "../context/employee/infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeRepository } from "../context/employee/domain/EmployeeRepository";
import { EmployeeFinder } from "../context/employee/application/EmployeeFinder";
import { EmployeeNotFoundError } from "../context/employee/domain/EmployeeNotFoundError";
@injectable()
export class EmployeeGetController {
  private employeeFinder: EmployeeFinder;
  constructor(
    @inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository,
  ) {
    this.employeeFinder = new EmployeeFinder(this.employeeRepository);
  }
  async run(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { params } = request;
    const { id } = params;
    try {
      const employee = await this.employeeFinder.run(id);
      reply.code(200).send(employee);
    } catch (error) {
      if (error instanceof EmployeeNotFoundError) {
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
