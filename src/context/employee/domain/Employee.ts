import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { Primitives } from "@codelytv/primitives-type";
import { EmployeeId } from "./EmployeeId";
import { EmployeeName } from "./EmployeeName";
import { EmployeeEmail } from "./EmployeeEmail";
import { EmployeeAvailableVacationDays } from "./EmployeeAvailableVacationDays";


export class Employee extends AggregateRoot {
  private constructor(
    readonly id: EmployeeId,
    readonly name: EmployeeName,
    readonly email: EmployeeEmail,
    readonly availableVacationDays: EmployeeAvailableVacationDays,
    readonly managerId: EmployeeId | null,
  ) {
    super();
  }

  static fromPrimitives(primitives: Primitives<Employee>): Employee {
    return new Employee(
      new EmployeeId(primitives.id),
      new EmployeeName(primitives.name),
      new EmployeeEmail(primitives.email),
      new EmployeeAvailableVacationDays(primitives.availableVacationDays),
      primitives.managerId ? new EmployeeId(primitives.managerId) : null,
    );
  }

  static create(
    id: string,
    name: string,
    email: string,
    managerId?: string,
  ): Employee {
    return Employee.fromPrimitives({
      id,
      name,
      email,
      availableVacationDays: 30,
      managerId: managerId ?? null,
    });
  }

  canRequestVacation(daysDeducted: number): boolean {
    return this.availableVacationDays.canUseVacationDays(daysDeducted);
  }

  toPrimitives(): Primitives<Employee> {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      availableVacationDays: this.availableVacationDays.value,
      managerId: this.managerId?.value ?? null,
    };
  }
}
