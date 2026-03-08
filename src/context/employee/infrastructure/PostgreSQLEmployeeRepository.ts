import { injectable, InjectionToken } from "tsyringe";
import { PostgresRepository } from "../../shared/infrastructure/PostgresRepository";
import { EmployeeRepository } from "../domain/EmployeeRepository";
import { Employee } from "../domain/Employee";
import { EmployeeId } from "../domain/EmployeeId";

export const EMPLOYEE_REPO_TOKEN: InjectionToken<EmployeeRepository> =
  "EmployeeRepository";

type DatabaseEmployeeRow = {
  id: string;
  name: string;
  email: string;
  available_vacation_days: number;
  manager_id: string;
};

@injectable()
export class PostgreSQLEmployeeRepository
  extends PostgresRepository<Employee>
  implements EmployeeRepository
{
  async save(employee: Employee): Promise<void> {
    const primitives = employee.toPrimitives();
    await this.execute`
      INSERT INTO employees (id, name, email, available_vacation_days, manager_id)
      VALUES (
        ${primitives.id},
        ${primitives.name},
        ${primitives.email},
        ${primitives.availableVacationDays},
        ${primitives.managerId}
      )
    `;
  }

  async search(id: EmployeeId): Promise<Employee | null> {
    return await this.searchOne`
      SELECT id, name, email, available_vacation_days, manager_id
      FROM employees
      WHERE id = ${id.value};
    `;
  }

  protected toAggregate(row: DatabaseEmployeeRow): Employee {
    return Employee.fromPrimitives({
      id: row.id,
      name: row.name,
      email: row.email,
      availableVacationDays: row.available_vacation_days,
      managerId: row.manager_id,
    });
  }
}
