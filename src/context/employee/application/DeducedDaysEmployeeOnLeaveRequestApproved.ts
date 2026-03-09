import { inject, injectable } from "tsyringe";
import { DomainEventClass } from "../../shared/domain/DomainEventClass";
import { DomainEventSubscriber } from "../../shared/domain/DomainEventSubscriber";
import { LeaveRequestApprovedDomainEvent } from "../../leaveRequest/domain/LeaveRequestApprovedDomainEvent";
import { EmployeeRepository } from "../domain/EmployeeRepository";
import { EMPLOYEE_REPO_TOKEN } from "../infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeDeductedDays } from "./EmployeeDeductedDays";

@injectable()
export class DeductDaysEmployeeOnLeaveRequestApproved implements DomainEventSubscriber<LeaveRequestApprovedDomainEvent> {
  private employeeDeductedDays: EmployeeDeductedDays;
  constructor(
    @inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository,
  ) {
    this.employeeDeductedDays = new EmployeeDeductedDays(
      this.employeeRepository,
    );
  }
  async on(event: LeaveRequestApprovedDomainEvent): Promise<void> {
    await this.employeeDeductedDays.deductDays(
      event.daysDeducted,
      event.employeeId,
    );
  }

  subscribedTo(): DomainEventClass[] {
    return [LeaveRequestApprovedDomainEvent];
  }

  name(): string {
    return "company.deduct_days_employee_on_leave_request_approval";
  }
}
