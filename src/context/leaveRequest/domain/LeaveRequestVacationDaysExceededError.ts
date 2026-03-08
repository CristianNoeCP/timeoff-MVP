export class LeaveRequestVacationDaysExceededError extends Error {
  readonly name = "LeaveRequestVacationDaysExceededError";

  constructor(daysDeducted: number) {
    super(`Requested vacation days <${daysDeducted}> exceed available days`);
  }
}
