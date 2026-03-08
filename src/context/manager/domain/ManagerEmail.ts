import { StringValueObject } from "../../shared/domain/value-object/StringValueObject";

export class ManagerEmail extends StringValueObject {

  constructor(value: string) {
    super(value);
    this.ensureEmailIsValid(value);
  }
  ensureEmailIsValid(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format");
    }
  }
}