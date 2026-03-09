import { EventBus } from "../../shared/domain/EventBus";
import { LeaveRequestId } from "../domain/LeaveRequestId";
import { LeaveRequestNotFoundError } from "../domain/LeaveRequestNotFoundError";
import { LeaveRequestRepository } from "../domain/LeaveRequestRepository";
import { LeaveRequestUnauthorizedError } from "../domain/LeaveRequestUnauthorizedError";

export class LeaveRequestApprover {
  constructor(
    private readonly repository: LeaveRequestRepository,
    private eventBus: EventBus,
  ) {}

  async run(id: string, managerId: string): Promise<void> {
    const leaveRequest = await this.repository.search(new LeaveRequestId(id));
    if (!leaveRequest) {
      throw new LeaveRequestNotFoundError(id);
    }
    if (!leaveRequest.isAuthorized(managerId)) {
      throw new LeaveRequestUnauthorizedError(id, managerId);
    }

    const approved = leaveRequest.approve();
    await this.repository.updateStatus(approved);
    await this.eventBus.publish(approved.pullDomainEvents());
  }
}
