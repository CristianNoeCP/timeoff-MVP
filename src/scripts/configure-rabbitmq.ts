import "dotenv/config";
import "reflect-metadata";
import "../context/shared/dependency-injection/tsyringe.config";
import { container } from "tsyringe";
import { RabbitMqConnection } from "../context/shared/infrastructure/events_bus/RabbitMqConnection";
import { DomainEvent } from "../context/shared/domain/DomainEvent";
import { DomainEventSubscriber } from "../context/shared/domain/DomainEventSubscriber";

const connection = container.resolve(RabbitMqConnection);

const EXCHANGE_NAME = "domain_events";
const subscribers =
  container.resolveAll<DomainEventSubscriber<DomainEvent>>("subscriber");

const queues: {
  name: string;
  bindingKeys: string[];
}[] = subscribers.map((subscriber) => ({
  name: subscriber.name(),
  bindingKeys: subscriber.subscribedTo().map((event) => event.eventName),
}));

async function main(): Promise<void> {
  await connection.connect();
  await connection.declareExchange(EXCHANGE_NAME);

  await Promise.all(
    queues.map((queue) =>
      connection.declareQueue(queue.name, EXCHANGE_NAME, queue.bindingKeys),
    ),
  );

  await connection.close();
}

main().catch(console.error);
