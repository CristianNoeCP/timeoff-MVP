
import { LeaveRequestId } from "../domain/LeaveRequestId";
import { LeaveRequestNotFoundError } from "../domain/LeaveRequestNotFoundError";
import { LeaveRequestRepository } from "../domain/LeaveRequestRepository";

export class LeaveRequestFinder {
  constructor(private readonly repository: LeaveRequestRepository) {}

  async run(id: string) {
    const leaveRequest = await this.repository.search(new LeaveRequestId(id));
    if (!leaveRequest) {
      throw new LeaveRequestNotFoundError(id);
    }
    return leaveRequest.toPrimitives();
  }
}
