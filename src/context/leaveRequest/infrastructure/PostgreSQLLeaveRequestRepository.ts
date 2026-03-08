import { PostgresRepository } from "../../shared/infrastructure/PostgresRepository";
import { injectable, InjectionToken } from "tsyringe";
import { LeaveRequestRepository } from "../domain/LeaveRequestRepository";
import { LeaveRequest } from "../domain/LeaveRequest";
import { LeaveRequestId } from "../domain/LeaveRequestId";

export const LEAVE_REQUEST_REPO_TOKEN: InjectionToken<LeaveRequestRepository> =
  "LeaveRequestRepository";

type DatabaseLeaveRequestRow = {
  id: string;
  days_deducted: number;
  employee_id: string;
  manager_id: string;
  status: string;
};

@injectable()
export class PostgreSQLLeaveRequestRepository
  extends PostgresRepository<LeaveRequest>
  implements LeaveRequestRepository
{
  async save(leaveRequest: LeaveRequest): Promise<void> {
    const leaveRequestPrimitives = leaveRequest.toPrimitives();
    await this.execute`
			INSERT INTO leave_requests (id, days_deducted, employee_id, manager_id, status)
			VALUES (
				${leaveRequestPrimitives.id},
				${leaveRequestPrimitives.daysDeducted},
				${leaveRequestPrimitives.employeeId},
				${leaveRequestPrimitives.managerId},
				${leaveRequestPrimitives.status}
			)
		`;
  }
  async search(id: LeaveRequestId): Promise<LeaveRequest | null> {
    return await this.searchOne`
			SELECT id, days_deducted, employee_id, manager_id, status
			FROM leave_requests
			WHERE id = ${id.value};
		`;
  }

  protected toAggregate(row: DatabaseLeaveRequestRow): LeaveRequest {
    return LeaveRequest.fromPrimitives({
      status: row.status,
      id: row.id,
      daysDeducted: row.days_deducted,
      employeeId: row.employee_id,
      managerId: row.manager_id,
    });
  }
}
