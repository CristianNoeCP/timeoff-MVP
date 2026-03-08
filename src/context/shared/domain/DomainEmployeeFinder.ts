
import { Employee } from "../../employee/domain/Employee";
import { EmployeeId } from "../../employee/domain/EmployeeId";
import { EmployeeRepository } from "../../employee/domain/EmployeeRepository";
export class DomainEmployeeFinder {
  constructor(private readonly repository: EmployeeRepository) {}

  async find(id: string): Promise<Employee | null> {
    const employee = await this.repository.search(new EmployeeId(id));
    return employee;
  }
}
