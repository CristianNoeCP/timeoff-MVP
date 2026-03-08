export abstract class NumberValueObject {
  public readonly value: number;
  constructor(value: number) {
    this.guard(value);
    this.value = value;
  }
  private guard(value: number): void {
    if (typeof value !== "number") {
      throw new Error("Value must be a number");
    }
    if (isNaN(value)) {
      throw new Error("Value must be a number");
    }
  }
}
