import { EmployeeRepository } from "../../employee/domain/EmployeeRepository";
import { DomainEmployeeFinder } from "../../shared/domain/DomainEmployeeFinder";
import { DomainManagerFinder } from "../../shared/domain/DomainManagerFinder";
import { NotificationEmail } from "../../shared/domain/NotificationEmail";
import { ManagerRepository } from "../domain/ManagerRepository";

export class ManagerNotification {
  private employeeFinder: DomainEmployeeFinder;
  private managerFinder: DomainManagerFinder;
  constructor(
    private readonly notificationEmail: NotificationEmail,
    private readonly employeeRepository: EmployeeRepository,
    private readonly managerRepository: ManagerRepository,
  ) {
    this.employeeFinder = new DomainEmployeeFinder(this.employeeRepository);
    this.managerFinder = new DomainManagerFinder(this.managerRepository);
  }

  async notify(
    managerId: string,
    daysDeducted: number,
    employeeId: string,
  ): Promise<void> {
    const manager = await this.managerFinder.find(managerId);
    const employee = await this.employeeFinder.find(employeeId);
    if (!manager || !employee) {
      console.error(
        `Manager or employee not found for managerId: ${managerId}, employeeId: ${employeeId}`,
      );
      return;
    }
    const { email } = manager.toPrimitives();
    const { name } = employee.toPrimitives();
    await this.notificationEmail.send(
      email,
      `New leave request created for employee ${name} with ${daysDeducted} days deducted`,
    );
  }
}
