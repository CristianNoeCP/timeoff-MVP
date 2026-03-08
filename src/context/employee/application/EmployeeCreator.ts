import { Employee } from "../domain/Employee";
import { EmployeeRepository } from "../domain/EmployeeRepository";

export class EmployeeCreator {
  constructor(private readonly repository: EmployeeRepository) {}

  async run(
    id: string,
    name: string,
    email: string,
    managerId?: string,
  ): Promise<void> {
    const employee = Employee.create(id, name, email, managerId);
    await this.repository.save(employee);
  }
}
