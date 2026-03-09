export class LeaveRequestUnauthorizedError extends Error {
  readonly name = "LeaveRequestUnauthorizedError";

  constructor(id: string, managerId: string) {
    super(`Manager with id <${managerId}> is not authorized to approve leave request with id <${id}>`);
  }
}
