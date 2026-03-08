import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import { LeaveRequestCreator } from "../context/leaveRequest/application/LeaveRequestCreator";
import { LeaveRequestRepository } from "../context/leaveRequest/domain/LeaveRequestRepository";
import { LeaveRequestPostBody } from "../schemas/leave_request.schemas";
import { LEAVE_REQUEST_REPO_TOKEN } from "../context/leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import { EmployeeRepository } from "../context/employee/domain/EmployeeRepository";
import { EMPLOYEE_REPO_TOKEN } from "../context/employee/infrastructure/PostgreSQLEmployeeRepository";
import { RABBIT_MQ_EVENT_BUS_TOKEN, RabbitMqEventBus } from "../context/shared/infrastructure/events_bus/RabbitMqEventBus";


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
    const { id, employeeId, managerId, daysDeducted } = body;
    await this.leaveRequestCreator.run(id, employeeId, managerId, daysDeducted);
    reply.code(201).send();
  }
}
