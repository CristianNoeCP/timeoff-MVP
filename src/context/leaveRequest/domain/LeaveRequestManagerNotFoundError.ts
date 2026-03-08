export class LeaveRequestManagerNotFoundError extends Error {
  readonly name = "LeaveRequestManagerNotFoundError";

  constructor(id: string) {
    super(`Manager with id <${id}> not found for leave request`);
  }
}
