export class LeaveRequestNotFoundError extends Error {
  readonly name = "LeaveRequestNotFoundError";

  constructor(id: string) {
    super(`LeaveRequest with id <${id}> not found`);
  }
}
