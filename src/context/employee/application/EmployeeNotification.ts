import { EmployeeRepository } from "../domain/EmployeeRepository";
import { DomainEmployeeFinder } from "../../shared/domain/DomainEmployeeFinder";
import { NotificationEmail } from "../../shared/domain/NotificationEmail";

export class EmployeeNotification {
  private employeeFinder: DomainEmployeeFinder;
  constructor(
    private readonly notificationEmail: NotificationEmail,
    private readonly employeeRepository: EmployeeRepository,
  ) {
    this.employeeFinder = new DomainEmployeeFinder(this.employeeRepository);
  }

  async notify(
    daysDeducted: number,
    employeeId: string,
    status: string,
  ): Promise<void> {
    const employee = await this.employeeFinder.find(employeeId);
    if (!employee) {
      console.error(
        `Employee not found for employeeId: ${employeeId}`,
      );
      return;
    }
    const { email } = employee.toPrimitives();
    await this.notificationEmail.send(
      email,
      `The leave request was ${status} for ${daysDeducted} days.`,
    );
  }
}
