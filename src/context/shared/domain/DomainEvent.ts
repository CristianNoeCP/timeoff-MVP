import { UuidValueObject } from "./value-object/UuidValueObject";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
	static fromPrimitives: (
		aggregateId: string,
		eventId: string,
		occurredAt: Date,
		attributes: DomainEventAttributes,
	) => DomainEvent;

	public readonly eventId: string;
	public readonly occurredAt: Date;

	protected constructor(
		public readonly eventName: string,
		public readonly aggregateId: string,
		eventId?: string,
		occurredAt?: Date,
	) {
		this.eventId = eventId ?? UuidValueObject.random().value;
		this.occurredAt = occurredAt ?? new Date();
	}

	abstract toPrimitives(): DomainEventAttributes;
}
