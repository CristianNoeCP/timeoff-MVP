import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import { LeaveRequestCreator } from "../context/leaveRequest/application/LeaveRequestCreator";
import { LeaveRequestRepository } from "../context/leaveRequest/domain/LeaveRequestRepository";
import { LeaveRequestPostBody } from "../schemas/leave_request.schemas";
import { LEAVE_REQUEST_REPO_TOKEN } from "../context/leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import { EmployeeRepository } from "../context/employee/domain/EmployeeRepository";
import { EMPLOYEE_REPO_TOKEN } from "../context/employee/infrastructure/PostgreSQLEmployeeRepository";
import {
  RABBIT_MQ_EVENT_BUS_TOKEN,
  RabbitMqEventBus,
} from "../context/shared/infrastructure/events_bus/RabbitMqEventBus";
import { LeaveRequestEmployeeNotFoundError } from "../context/leaveRequest/domain/LeaveRequestEmployeeNotFoundError";
import { LeaveRequestVacationDaysExceededError } from "../context/leaveRequest/domain/LeaveRequestVacationDaysExceededError";

@injectable()
export class LeaveRequestPostController {
  private leaveRequestCreator: LeaveRequestCreator;
  constructor(
    @inject(LEAVE_REQUEST_REPO_TOKEN)
    private leaveRequestRepository: LeaveRequestRepository,
    @inject(EMPLOYEE_REPO_TOKEN)
    private employeeRepository: EmployeeRepository,
    @inject(RABBIT_MQ_EVENT_BUS_TOKEN) private eventBus: RabbitMqEventBus,
  ) {
    this.leaveRequestCreator = new LeaveRequestCreator(
      this.leaveRequestRepository,
      this.employeeRepository,
      this.eventBus,
    );
  }
  async run(
    request: FastifyRequest<{ Body: LeaveRequestPostBody }>,
    reply: FastifyReply,
  ) {
    const { body } = request;
    const { id, employeeId, daysDeducted } = body;
    try {
      await this.leaveRequestCreator.run(id, employeeId, daysDeducted);
      reply.code(201).send();
    } catch (error) {
      switch (true) {
        case error instanceof LeaveRequestEmployeeNotFoundError:
          reply.code(404).send({ error: error.name, message: error.message });
          return;
        case error instanceof LeaveRequestVacationDaysExceededError:
          reply.code(409).send({ error: error.name, message: error.message });
          return;
        default:
          reply.code(500).send({
            error: "InternalServerError",
            message: "An unexpected error occurred",
          });
          return;
      }
    }
  }
}
