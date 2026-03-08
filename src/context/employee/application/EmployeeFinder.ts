
import { EmployeeId } from "../domain/EmployeeId";
import { EmployeeNotFoundError } from "../domain/EmployeeNotFoundError";
import { EmployeeRepository } from "../domain/EmployeeRepository";

export class EmployeeFinder {
  constructor(private readonly repository: EmployeeRepository) {}

  async run(id: string) {
    const employee = await this.repository.search(new EmployeeId(id));
    if (!employee) {
      throw new EmployeeNotFoundError(id);
    }
    return employee.toPrimitives();
  }
}
