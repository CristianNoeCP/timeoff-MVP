import { LeaveRequestId } from "../domain/LeaveRequestId";
import { LeaveRequestNotFoundError } from "../domain/LeaveRequestNotFoundError";
import { LeaveRequestRepository } from "../domain/LeaveRequestRepository";
import { LeaveRequestUnauthorizedError } from "../domain/LeaveRequestUnauthorizedError";

export class LeaveRequestRejecter {
  constructor(private readonly repository: LeaveRequestRepository) {}

  async run(id: string, managerId: string): Promise<void> {
    const leaveRequest = await this.repository.search(new LeaveRequestId(id));
    if (!leaveRequest) {
      throw new LeaveRequestNotFoundError(id);
    }
    if (!leaveRequest.isAuthorized(managerId)) {
      throw new LeaveRequestUnauthorizedError(id, managerId);
    }

    const rejected = leaveRequest.reject();
    await this.repository.save(rejected);
  }
}
