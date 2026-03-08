import { EmployeeRepository } from "../../employee/domain/EmployeeRepository";
import { DomainEmployeeFinder } from "../../shared/domain/DomainEmployeeFinder";
import { EventBus } from "../../shared/domain/EventBus";
import { LeaveRequest } from "../domain/LeaveRequest";
import { LeaveRequestEmployeeNotFoundError } from "../domain/LeaveRequestEmployeeNotFoundError";
import { LeaveRequestManagerNotFoundError } from "../domain/LeaveRequestManagerNotFoundError";
import { LeaveRequestRepository } from "../domain/LeaveRequestRepository";
import { LeaveRequestVacationDaysExceededError } from "../domain/LeaveRequestVacationDaysExceededError";

export class LeaveRequestCreator {
  private employeeFinder: DomainEmployeeFinder;
  constructor(
    private repository: LeaveRequestRepository,
    private employeeRepository: EmployeeRepository,
    private eventBus: EventBus,
  ) {
    this.employeeFinder = new DomainEmployeeFinder(this.employeeRepository);
  }
  async run(
    id: string,
    employeeId: string,
    managerId: string,
    daysDeducted: number,
  ): Promise<void> {
    const employee = await this.employeeFinder.find(employeeId);
    if (!employee) {
      throw new LeaveRequestEmployeeNotFoundError(employeeId);
    }
    if (!employee.canRequestVacation(daysDeducted)) {
      throw new LeaveRequestVacationDaysExceededError(daysDeducted);
    }
    const manager = await this.employeeFinder.find(managerId);
    if (!manager) {
      throw new LeaveRequestManagerNotFoundError(managerId);
    }
    const leaveRequest = LeaveRequest.create(
      id,
      daysDeducted,
      employeeId,
      managerId,
    );
    this.repository.save(leaveRequest);
    this.eventBus.publish(leaveRequest.pullDomainEvents());
  }
}
