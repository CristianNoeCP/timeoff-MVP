import { ManagerRepository } from "../../manager/domain/ManagerRepository";
import { DomainManagerFinder } from "../../shared/domain/DomainManagerFinder";
import { Employee } from "../domain/Employee";
import { EmployeeManagerNotFoundError } from "../domain/EmployeeManagerNotFoundError";
import { EmployeeRepository } from "../domain/EmployeeRepository";

export class EmployeeCreator {
  private managerFinder: DomainManagerFinder;
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly managerRepository: ManagerRepository,
  ) {
    this.managerFinder = new DomainManagerFinder(this.managerRepository);
  }

  async run(
    id: string,
    name: string,
    email: string,
    managerId: string,
  ): Promise<void> {
    const manager = await this.managerFinder.find(managerId);
    if (!manager) {
      throw new EmployeeManagerNotFoundError(managerId);
    }
    const employee = Employee.create(id, name, email, managerId);
    await this.repository.save(employee);
  }
}
