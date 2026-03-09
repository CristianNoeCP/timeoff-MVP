export class LeaveRequestPendingError extends Error {
  readonly name = "LeaveRequestPendingError";

  constructor(id: string) {
    super(`Leave request with id <${id}> is not pending`);
  }
}
