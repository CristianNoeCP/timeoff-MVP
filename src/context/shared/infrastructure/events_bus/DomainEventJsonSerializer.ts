import { DomainEvent } from "../../domain/DomainEvent";


export class DomainEventJsonSerializer {
	static serialize(event: DomainEvent): string {
		return JSON.stringify({
			data: {
				id: event.eventId,
				type: event.eventName,
				occurred_at: event.occurredAt.toISOString(),
				aggregateId: event.aggregateId,
				attributes: event.toPrimitives(),
			},
		});
	}
}