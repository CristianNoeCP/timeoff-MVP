import "dotenv/config";
import "reflect-metadata";
import "../context/shared/dependency-injection/tsyringe.config";

import { ConsumeMessage } from "amqplib";
import { container } from "tsyringe";
import { DomainEvent } from "../context/shared/domain/DomainEvent";
import { DomainEventClass } from "../context/shared/domain/DomainEventClass";
import { DomainEventSubscriber } from "../context/shared/domain/DomainEventSubscriber";
import { RabbitMqConnection } from "../context/shared/infrastructure/events_bus/RabbitMqConnection";
import { DomainEventJsonDeserializer } from "../context/shared/infrastructure/events_bus/DomainEventJsonDeserializer";


const connection = container.resolve(RabbitMqConnection);

const subscribers =
  container.resolveAll<DomainEventSubscriber<DomainEvent>>("subscriber");

const eventMapping = new Map<string, DomainEventClass>();

subscribers.forEach((subscriber) => {
	subscriber.subscribedTo().forEach((eventClass) => {
		eventMapping.set(eventClass.eventName, eventClass);
	});
});

const deserializer = new DomainEventJsonDeserializer(eventMapping);

async function main(): Promise<void> {
	await connection.connect();

	await Promise.all(
		subscribers.map((subscriber) => connection.consume(subscriber.name(), consume(subscriber))),
	);
}

function consume(subscriber: DomainEventSubscriber<DomainEvent>) {
	return async function (message: ConsumeMessage): Promise<void> {
		const content = message.content.toString();
		const domainEvent = deserializer.deserialize(content);

		await subscriber.on(domainEvent);
		await connection.ack(message);
	};
}

main().catch(console.error);
