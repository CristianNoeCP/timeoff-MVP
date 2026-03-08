import { LeaveRequest } from "./LeaveRequest";
import { LeaveRequestId } from "./LeaveRequestId";

export interface LeaveRequestRepository {
  save(leaveRequest: LeaveRequest): Promise<void>;
  search(id: LeaveRequestId): Promise<LeaveRequest | null>;
}
