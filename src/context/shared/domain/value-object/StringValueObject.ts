export abstract class StringValueObject {
  public readonly value: string;
  constructor(value: string) {
    this.guard(value);
    this.value = value;
  }
  private guard(value: string): void {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
    if (value.length === 0) {
      throw new Error("Value must not be empty");
    }
  }
}
