import { Employee } from "./Employee";
import { EmployeeId } from "./EmployeeId";

export interface EmployeeRepository {
  save(employee: Employee): Promise<void>;
  updateDays(employee: Employee): Promise<void>;
  search(id: EmployeeId): Promise<Employee | null>;
}
