export class EmployeeManagerNotFoundError extends Error {
  readonly name = "EmployeeManagerNotFoundError";

  constructor(id: string) {
    super(`Manager with id <${id}> not found`);
  }
}
