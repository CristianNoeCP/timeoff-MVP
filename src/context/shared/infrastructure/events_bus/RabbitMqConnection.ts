import amqplib, { ConsumeMessage } from "amqplib";

export type Settings = {
  username: string;
  password: string;
  vhost: string;
  connection: {
    hostname: string;
    port: number;
  };
};

export class RabbitMqConnection {
  private amqpConnection?: amqplib.ChannelModel;
  private amqpChannel?: amqplib.ConfirmChannel;
  private readonly settings: Settings;

  constructor(
    hostname: string,
    port: number,
    username: string,
    password: string,
    vhost: string,
  ) {
    this.settings = {
      username,
      password,
      vhost,
      connection: {
        hostname,
        port,
      },
    };
  }
  async connect(): Promise<void> {
    this.amqpConnection = await this.amqpConnect();
    this.amqpChannel = await this.amqpChannelConnect();
  }

  async close(): Promise<void> {
    await this.channel().close();
    await this.connection().close();
  }

  async declareExchange(exchangeName: string): Promise<void> {
    await this.channel().assertExchange(exchangeName, "topic", {
      durable: true,
    });
  }

  async declareQueue(
    queueName: string,
    exchangeName: string,
    bindingKeys: string[],
  ): Promise<void> {
    await this.channel().assertQueue(queueName, { durable: true });
    await Promise.all(
      bindingKeys.map((key) =>
        this.channel().bindQueue(queueName, exchangeName, key),
      ),
    );
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: Buffer,
    options: {
      messageId: string;
      contentType: string;
      contentEncoding: string;
      priority?: number;
      headers?: unknown;
    },
  ): Promise<void> {
    if (!this.amqpChannel) {
      await this.connect();
    }

    return new Promise((resolve: Function, reject: Function) => {
      this.channel().publish(
        exchange,
        routingKey,
        content,
        options,
        (error: unknown) => (error ? reject(error) : resolve()),
      );
    });
  }

  private connection(): amqplib.ChannelModel {
    if (!this.amqpConnection) {
      throw new Error("RabbitMQ not connected");
    }

    return this.amqpConnection;
  }

  private channel(): amqplib.ConfirmChannel {
    if (!this.amqpChannel) {
      throw new Error("RabbitMQ channel not connected");
    }

    return this.amqpChannel;
  }
  async consume(
    queue: string,
    subscriber: (message: ConsumeMessage) => {},
  ): Promise<void> {
    await this.channel().consume(queue, (message: ConsumeMessage | null) => {
      if (message) {
        subscriber(message);
      }
    });
  }

  async ack(message: ConsumeMessage): Promise<void> {
    this.channel().ack(message);
  }
  private async amqpConnect(): Promise<amqplib.ChannelModel> {
    const connection = await amqplib.connect({
      protocol: "amqp",
      hostname: this.settings.connection.hostname,
      port: this.settings.connection.port,
      username: this.settings.username,
      password: this.settings.password,
      vhost: this.settings.vhost,
    });

    connection.on("error", (error: unknown) => {
      throw error;
    });

    return connection;
  }

  private async amqpChannelConnect(): Promise<amqplib.ConfirmChannel> {
    const channel = await this.connection().createConfirmChannel();
    await channel.prefetch(1);

    return channel;
  }
}
