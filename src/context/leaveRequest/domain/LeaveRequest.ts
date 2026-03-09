import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { Primitives } from "@codelytv/primitives-type";
import { LeaveRequestId } from "./LeaveRequestId";
import { EmployeeId } from "../../employee/domain/EmployeeId";
import { LeaveRequestDaysDeducted } from "./LeaveRequestDaysDeducted";
import {
  LeaveRequestStatus,
  LeaveRequestStatusEnum,
} from "./LeaveRequestStatus";
import { LeaveRequestCreatedDomainEvent } from "./LeaveRequestCreatedDomainEvent";
import { LeaveRequestPendingError } from "./LeaveRequestPendingError";
import { LeaveRequestApprovedDomainEvent } from "./LeaveRequestApprovedDomainEvent";
import { LeaveRequestRejectedDomainEvent } from "./LeaveRequestRejectedDomainEvent";

export class LeaveRequest extends AggregateRoot {
  private constructor(
    readonly id: LeaveRequestId,
    readonly daysDeducted: LeaveRequestDaysDeducted,
    readonly employeeId: EmployeeId,
    readonly status: LeaveRequestStatus,
    readonly managerId: EmployeeId,
  ) {
    super();
  }

  static fromPrimitives(primitives: Primitives<LeaveRequest>): LeaveRequest {
    return new LeaveRequest(
      new LeaveRequestId(primitives.id),
      new LeaveRequestDaysDeducted(primitives.daysDeducted),
      new EmployeeId(primitives.employeeId),
      new LeaveRequestStatus(primitives.status),
      new EmployeeId(primitives.managerId),
    );
  }

  static create(
    id: string,
    daysDeducted: number,
    employeeId: string,
    managerId: string,
  ): LeaveRequest {
    const leaveRequest = LeaveRequest.fromPrimitives({
      id,
      daysDeducted,
      employeeId,
      managerId,
      status: LeaveRequestStatusEnum.PENDING,
    });
    leaveRequest.record(
      new LeaveRequestCreatedDomainEvent(
        id,
        employeeId,
        managerId,
        daysDeducted,
      ),
    );
    return leaveRequest;
  }

  toPrimitives(): Primitives<LeaveRequest> {
    return {
      id: this.id.value,
      daysDeducted: this.daysDeducted.value,
      status: this.status.value,
      employeeId: this.employeeId.value,
      managerId: this.managerId.value,
    };
  }
  approve(): LeaveRequest {
    if (this.status.value !== LeaveRequestStatusEnum.PENDING) {
      throw new LeaveRequestPendingError(this.id.value);
    }

    const leaveRequest = LeaveRequest.fromPrimitives({
      id: this.id.value,
      daysDeducted: this.daysDeducted.value,
      employeeId: this.employeeId.value,
      managerId: this.managerId.value,
      status: LeaveRequestStatusEnum.APPROVED,
    });
    leaveRequest.record(
      new LeaveRequestApprovedDomainEvent(
        leaveRequest.id.value,
        leaveRequest.employeeId.value,
        leaveRequest.managerId.value,
        leaveRequest.status.value,
        leaveRequest.daysDeducted.value,
      ),
    );
    return leaveRequest;
  }

  reject(): LeaveRequest {
    if (this.status.value !== LeaveRequestStatusEnum.PENDING) {
      throw new LeaveRequestPendingError(this.id.value);
    }
    const leaveRequest = LeaveRequest.fromPrimitives({
      id: this.id.value,
      daysDeducted: this.daysDeducted.value,
      employeeId: this.employeeId.value,
      managerId: this.managerId.value,
      status: LeaveRequestStatusEnum.APPROVED,
    });
    leaveRequest.record(
      new LeaveRequestRejectedDomainEvent(
        leaveRequest.id.value,
        leaveRequest.employeeId.value,
        leaveRequest.managerId.value,
        leaveRequest.status.value,
        leaveRequest.daysDeducted.value,
      ),
    );
    return leaveRequest;
  }

  isAuthorized(managerId: string): boolean {
    return this.managerId.value === managerId;
  }
}
