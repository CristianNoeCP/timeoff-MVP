import { NumberValueObject } from "../../shared/domain/value-object/NumberValueObject";


export class EmployeeAvailableVacationDays extends NumberValueObject {

  constructor(value: number) {
    super(value);

  }
ensureValueIsValid(value: number): void {
    if (value < 0) {
      throw new Error("Available vacation days cannot be negative");
    }
    if (value > 25) {
      throw new Error("Available vacation days cannot exceed 30");
    }
  }
canUseVacationDays(days: number): boolean {
    return this.value >= days;
  }
  deduct(days: number): EmployeeAvailableVacationDays {
    if (!this.canUseVacationDays(days)) {
      throw new Error(
        `Cannot deduct ${days} days. Only ${this.value} available vacation days.`,
      );
    }
    return new EmployeeAvailableVacationDays(this.value - days);
  }
}