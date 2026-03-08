import { DomainEvent } from "../../domain/DomainEvent";
import { DomainEventClass } from "../../domain/DomainEventClass";


export type DomainEventJson = {
	id: string;
	type: string;
	occurredAt: string;
	aggregateId: string;
	attributes: string;
};

export class DomainEventJsonDeserializer {
	constructor(private readonly eventMapping: Map<string, DomainEventClass>) {}

	deserialize(event: string): DomainEvent {
		const eventData = JSON.parse(event).data as DomainEventJson;
		const eventClass = this.eventMapping.get(eventData.type);

		if (!eventClass) {
			throw Error(`DomainEvent mapping not found for event ${eventData.type}`);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return eventClass.fromPrimitives(
			eventData.aggregateId,
			eventData.id,
			new Date(eventData.occurredAt),
			eventData.attributes,
		);
	}
}
