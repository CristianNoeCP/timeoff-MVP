import { NumberValueObject } from "../../shared/domain/value-object/NumberValueObject";

export class LeaveRequestDaysDeducted extends NumberValueObject {  
  constructor(value: number) {
    super(value);
    this.ensureIsValidDaysDeducted(value);
  }

  private ensureIsValidDaysDeducted(value: number): void {
    if (value <= 0) {
      throw new Error(`The days deducted <${value}> is not valid`);
    }
    if (value > 7) {
      throw new Error(`The days deducted <${value}> is not valid`);
    }
  }
}

