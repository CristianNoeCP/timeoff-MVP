import { inject, injectable, InjectionToken } from "tsyringe";
import { DomainEvent } from "../../domain/DomainEvent";
import { EventBus } from "../../domain/EventBus";
import { DomainEventJsonSerializer } from "./DomainEventJsonSerializer";
import { RabbitMqConnection } from "./RabbitMqConnection";
export const RABBIT_MQ_EVENT_BUS_TOKEN: InjectionToken<RabbitMqEventBus> =
  "RabbitMqEventBus";

@injectable()
export class RabbitMqEventBus implements EventBus {
  constructor(
    @inject(RabbitMqConnection) private readonly connection: RabbitMqConnection,
  ) {}

  async publish(events: DomainEvent[]): Promise<void> {
    const promises = events.map((event) => {
      const routingKey = event.eventName;
      const content = Buffer.from(DomainEventJsonSerializer.serialize(event));

      return this.connection.publish("domain_events", routingKey, content, {
        messageId: event.eventId,
        contentType: "application/json",
        contentEncoding: "utf-8",
      });
    });

    await Promise.all(promises);
  }
}
