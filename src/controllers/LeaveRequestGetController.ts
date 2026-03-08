import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import { LeaveRequestFinder } from "../context/leaveRequest/application/LeaveRequestFinder";
import { LeaveRequestRepository } from "../context/leaveRequest/domain/LeaveRequestRepository";
import { LEAVE_REQUEST_REPO_TOKEN } from "../context/leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import { LeaveRequestNotFoundError } from "../context/leaveRequest/domain/LeaveRequestNotFoundError";
@injectable()
export class LeaveRequestGetController {
  private leaveRequestFinder: LeaveRequestFinder;
  constructor(
    @inject(LEAVE_REQUEST_REPO_TOKEN) private leaveRequestRepository: LeaveRequestRepository,
  ) {
    this.leaveRequestFinder = new LeaveRequestFinder(this.leaveRequestRepository);
  }
  async run(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { params } = request;
    const { id } = params;
    try {
      const leaveRequest = await this.leaveRequestFinder.run(id);
      reply.code(200).send(leaveRequest);
    } catch (error) {
      if (error instanceof LeaveRequestNotFoundError) {
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
