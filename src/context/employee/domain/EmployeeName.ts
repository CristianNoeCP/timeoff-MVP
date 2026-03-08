import { StringValueObject } from "../../shared/domain/value-object/StringValueObject";

export class EmployeeName extends StringValueObject {

  constructor(value: string) {
    super(value);
    this.ensureValueIsValid(value);
  }
  ensureValueIsValid(value: string): void {
    if (value.length < 5) {
      throw new Error("Employee name must be at least 5 characters long");
    }
  }
}