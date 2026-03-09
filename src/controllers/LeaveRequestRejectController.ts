import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { LeaveRequestRepository } from "../context/leaveRequest/domain/LeaveRequestRepository";
import { LEAVE_REQUEST_REPO_TOKEN } from "../context/leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import { LeaveRequestNotFoundError } from "../context/leaveRequest/domain/LeaveRequestNotFoundError";
import {
  LeaveRequestManagerPatchBody,
  LeaveRequestParams,
} from "../schemas/leave_request.schemas";
import { LeaveRequestRejecter } from "../context/leaveRequest/application/LeaveRequestRejecter";
import { LeaveRequestUnauthorizedError } from "../context/leaveRequest/domain/LeaveRequestUnauthorizedError";
import { LeaveRequestPendingError } from "../context/leaveRequest/domain/LeaveRequestPendingError";
import {
  RABBIT_MQ_EVENT_BUS_TOKEN,
  RabbitMqEventBus,
} from "../context/shared/infrastructure/events_bus/RabbitMqEventBus";

@injectable()
export class LeaveRequestRejectController {
  private rejecter: LeaveRequestRejecter;
  constructor(
    @inject(LEAVE_REQUEST_REPO_TOKEN)
    private leaveRequestRepository: LeaveRequestRepository,
    @inject(RABBIT_MQ_EVENT_BUS_TOKEN) private eventBus: RabbitMqEventBus,
  ) {
    this.rejecter = new LeaveRequestRejecter(
      this.leaveRequestRepository,
      this.eventBus,
    );
  }

  async run(
    request: FastifyRequest<{
      Params: LeaveRequestParams;
      Body: LeaveRequestManagerPatchBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const { managerId } = request.body;
      await this.rejecter.run(id, managerId);
      reply.code(201).send();
    } catch (error) {
      switch (true) {
        case error instanceof LeaveRequestNotFoundError:
          reply.code(404).send({ error: error.name, message: error.message });
          return;
        case error instanceof LeaveRequestUnauthorizedError:
          reply.code(403).send({ error: error.name, message: error.message });
          return;
        case error instanceof LeaveRequestPendingError:
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
