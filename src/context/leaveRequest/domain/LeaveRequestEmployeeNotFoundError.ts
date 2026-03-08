export class LeaveRequestEmployeeNotFoundError extends Error {
  readonly name = "LeaveRequestEmployeeNotFoundError";

  constructor(id: string) {
    super(`Employee with id <${id}> not found for leave request`);
  }
}
