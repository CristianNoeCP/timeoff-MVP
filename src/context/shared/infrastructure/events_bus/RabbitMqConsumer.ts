import { container, injectable } from "tsyringe";
import { ConsumeMessage } from "amqplib";
import { DomainEvent } from "../../domain/DomainEvent";
import { DomainEventClass } from "../../domain/DomainEventClass";
import { DomainEventSubscriber } from "../../domain/DomainEventSubscriber";
import { RabbitMqConnection } from "./RabbitMqConnection";
import { DomainEventJsonDeserializer } from "./DomainEventJsonDeserializer";

@injectable()
export class RabbitMqConsumer {
  constructor(private readonly connection: RabbitMqConnection) {}

  async start(): Promise<void> {
    const subscribers =
      container.resolveAll<DomainEventSubscriber<DomainEvent>>("subscriber");

    const eventMapping = new Map<string, DomainEventClass>();

    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((eventClass) => {
        eventMapping.set(eventClass.eventName, eventClass);
      });
    });

    const deserializer = new DomainEventJsonDeserializer(eventMapping);

    await this.connection.connect();

    await Promise.all(
      subscribers.map((subscriber) =>
        this.connection.consume(
          subscriber.name(),
          this.buildConsumeFn(subscriber, deserializer),
        ),
      ),
    );
  }

  private buildConsumeFn(
    subscriber: DomainEventSubscriber<DomainEvent>,
    deserializer: DomainEventJsonDeserializer,
  ) {
    return async (message: ConsumeMessage): Promise<void> => {
      const content = message.content.toString();
      const domainEvent = deserializer.deserialize(content);

      await subscriber.on(domainEvent);
      await this.connection.ack(message);
    };
  }
}
