import { StringValueObject } from "../../shared/domain/value-object/StringValueObject";
export enum LeaveRequestStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export class LeaveRequestStatus extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidStatus(value);
  }

  private ensureIsValidStatus(value: string): void {
    if (
      !Object.values(LeaveRequestStatusEnum).includes(
        value as LeaveRequestStatusEnum,
      )
    ) {
      throw new Error(`Invalid status value: ${value}`);
    }
  }
  public approve(): LeaveRequestStatus {
    if (this.value !== LeaveRequestStatusEnum.PENDING) {
      throw new Error(`Cannot approve a leave request that is not pending`);
    }
    return new LeaveRequestStatus(LeaveRequestStatusEnum.APPROVED);
  }
  public reject(): LeaveRequestStatus {
    if (this.value !== LeaveRequestStatusEnum.PENDING) {
      throw new Error(`Cannot reject a leave request that is not pending`);
    }
    return new LeaveRequestStatus(LeaveRequestStatusEnum.REJECTED);
  }
}
