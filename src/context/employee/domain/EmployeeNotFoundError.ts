export class EmployeeNotFoundError extends Error {
  readonly name = "EmployeeNotFoundError";

  constructor(id: string) {
    super(`Employee with id <${id}> not found`);
  }
}
