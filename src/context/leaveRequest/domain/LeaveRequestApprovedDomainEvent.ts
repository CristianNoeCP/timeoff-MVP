import {
  DomainEvent,
  DomainEventAttributes,
} from "../../shared/domain/DomainEvent";

export class LeaveRequestApprovedDomainEvent extends DomainEvent {
  static eventName = "company.v1.leave-request.approved";

  constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly managerId: string,
    public readonly status: string,
    public readonly daysDeducted: number,
    eventId?: string,
    occurredAt?: Date,
  ) {
    super(LeaveRequestApprovedDomainEvent.eventName, id, eventId, occurredAt);
  }

  static fromPrimitives(
    aggregateId: string,
    eventId: string,
    occurredAt: Date,
    attributes: DomainEventAttributes,
  ): LeaveRequestApprovedDomainEvent {
    return new LeaveRequestApprovedDomainEvent(
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
