import { StringValueObject } from "../../shared/domain/value-object/StringValueObject";

export class ManagerName extends StringValueObject {

  constructor(value: string) {
    super(value);
    this.ensureValueIsValid(value);
  }
  ensureValueIsValid(value: string): void {
    if (value.length < 5) {
      throw new Error("Manager name must be at least 5 characters long");
    }
  }
}