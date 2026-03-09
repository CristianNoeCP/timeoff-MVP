import { EmployeeRepository } from "../domain/EmployeeRepository";
import { DomainEmployeeFinder } from "../../shared/domain/DomainEmployeeFinder";

export class EmployeeDeductedDays {
  private employeeFinder: DomainEmployeeFinder;
  constructor(private readonly employeeRepository: EmployeeRepository) {
    this.employeeFinder = new DomainEmployeeFinder(this.employeeRepository);
  }

  async deductDays(daysDeducted: number, employeeId: string): Promise<void> {
    try {
      const employee = await this.employeeFinder.find(employeeId);
      if (!employee) {
        console.error(`Employee not found for employeeId: ${employeeId}`);
        return;
      }

      employee.deductDays(daysDeducted);
      await this.employeeRepository.updateDays(employee);
    } catch (error) {
      console.error(
        `Error deducting days for employeeId: ${employeeId}`,
        error,
      );
    }
  }
}
