import {
  DomainEvent,
  DomainEventAttributes,
} from "../../shared/domain/DomainEvent";

export class LeaveRequestRejectedDomainEvent extends DomainEvent {
  static eventName = "company.v1.leave-request.rejected";

  constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly managerId: string,
    public readonly status: string,
    public readonly daysDeducted: number,
    eventId?: string,
    occurredAt?: Date,
  ) {
    super(LeaveRequestRejectedDomainEvent.eventName, id, eventId, occurredAt);
  }

  static fromPrimitives(
    aggregateId: string,
    eventId: string,
    occurredAt: Date,
    attributes: DomainEventAttributes,
  ): LeaveRequestRejectedDomainEvent {
    return new LeaveRequestRejectedDomainEvent(
      aggregateId,
      attributes.employeeId as string,
      attributes.managerId as string,
      attributes.status as string,
      attributes.daysDeducted as number,
      eventId,
      occurredAt,
    );
  }

  toPrimitives(): DomainEventAttributes {
    return {
      id: this.id,
      employeeId: this.employeeId,
      managerId: this.managerId,
      status: this.status,
      daysDeducted: this.daysDeducted,
    };
  }
}
