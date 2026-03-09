import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";

import { LeaveRequestRepository } from "../context/leaveRequest/domain/LeaveRequestRepository";
import { LEAVE_REQUEST_REPO_TOKEN } from "../context/leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import { LeaveRequestNotFoundError } from "../context/leaveRequest/domain/LeaveRequestNotFoundError";
import {
  LeaveRequestManagerPatchBody,
  LeaveRequestParams,
} from "../schemas/leave_request.schemas";
import { LeaveRequestApprover } from "../context/leaveRequest/application/LeaveRequestApprover";
import { LeaveRequestUnauthorizedError } from "../context/leaveRequest/domain/LeaveRequestUnauthorizedError";
import { LeaveRequestPendingError } from "../context/leaveRequest/domain/LeaveRequestPendingError";

@injectable()
export class LeaveRequestApprovalController {
  private approver: LeaveRequestApprover;
  constructor(
    @inject(LEAVE_REQUEST_REPO_TOKEN)
    private leaveRequestRepository: LeaveRequestRepository,
  ) {
    this.approver = new LeaveRequestApprover(this.leaveRequestRepository);
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
      await this.approver.run(id, managerId);
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
