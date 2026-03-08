import { v4 as uuid, validate } from "uuid";
import { StringValueObject } from "./StringValueObject";

export class UuidValueObject extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }
  static random(): UuidValueObject {
    return new UuidValueObject(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new Error(`The UUID <${id}> is not valid`);
    }
  }
}
