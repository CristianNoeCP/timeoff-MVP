
import { DomainEvent, DomainEventAttributes } from "../../shared/domain/DomainEvent";


export class LeaveRequestCreatedDomainEvent extends DomainEvent {
	static eventName = "company.v1.leave-request.created";

	constructor(
		public readonly id: string,
		public readonly employeeId: string,
		public readonly managerId: string,
		public readonly daysDeducted: number,
		eventId?: string,
		occurredAt?: Date,
	) {
		super(LeaveRequestCreatedDomainEvent.eventName, id, eventId, occurredAt);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredAt: Date,
		attributes: DomainEventAttributes,
	): LeaveRequestCreatedDomainEvent {
		return new LeaveRequestCreatedDomainEvent(
			aggregateId,
			attributes.employeeId as string,
			attributes.managerId as string,
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
			daysDeducted: this.daysDeducted,
		};
	}
}
