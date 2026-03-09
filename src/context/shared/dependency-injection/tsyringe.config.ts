import { container } from "tsyringe";
import { PostgresConnection } from "../../shared/infrastructure/PostgresConnection";
import {
  EMPLOYEE_REPO_TOKEN,
  PostgreSQLEmployeeRepository,
} from "../../employee/infrastructure/PostgreSQLEmployeeRepository";
import {
  LEAVE_REQUEST_REPO_TOKEN,
  PostgreSQLLeaveRequestRepository,
} from "../../leaveRequest/infrastructure/PostgreSQLLeaveRequestRepository";
import {
  MANAGER_REPO_TOKEN,
  PostgreSQLManagerRepository,
} from "../../manager/infrastructure/PostgreSQLManagerRepository";
import { RabbitMqConnection } from "../../shared/infrastructure/events_bus/RabbitMqConnection";
import {
  RABBIT_MQ_EVENT_BUS_TOKEN,
  RabbitMqEventBus,
} from "../../shared/infrastructure/events_bus/RabbitMqEventBus";
import { SendNotificationManagerOnLeaveRequestCreated } from "../../manager/application/SendNotificationManagerOnLeaveRequestCreated";
import {
  RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN,
  ResendEmailNotificationEmail,
} from "../../shared/infrastructure/notification/ResendEmailNotificationEmail";
import { ResendConnection } from "../../shared/infrastructure/notification/ResendConnection";
import { SendNotificationEmployeeOnLeaveRequestRejected } from "../../employee/application/SendNotificationEmployeeOnLeaveRequestRejected";
import { SendNotificationEmployeeOnLeaveRequestApproved } from "../../employee/application/SendNotificationEmployeeOnLeaveRequestApproved";
import { DeductDaysEmployeeOnLeaveRequestApproved } from "../../employee/application/DeducedDaysEmployeeOnLeaveRequestApproved";

container.register(EMPLOYEE_REPO_TOKEN, {
  useClass: PostgreSQLEmployeeRepository,
});
container.register(LEAVE_REQUEST_REPO_TOKEN, {
  useClass: PostgreSQLLeaveRequestRepository,
});
container.register(MANAGER_REPO_TOKEN, {
  useClass: PostgreSQLManagerRepository,
});
container.register(RABBIT_MQ_EVENT_BUS_TOKEN, {
  useClass: RabbitMqEventBus,
});
container.register(PostgresConnection, {
  useFactory: () => {
    return new PostgresConnection(
      process.env.POSTGRES_HOST || "",
      Number(process.env.POSTGRES_PORT) || 0,
      process.env.POSTGRES_USER || "",
      process.env.POSTGRES_PASSWORD || "",
      process.env.POSTGRES_DB || "",
    );
  },
});

container.register(RabbitMqConnection, {
  useFactory: () => {
    return new RabbitMqConnection(
      process.env.RABBITMQ_HOST || "",
      Number(process.env.RABBITMQ_PORT) || 0,
      process.env.RABBITMQ_USER || "",
      process.env.RABBITMQ_PASSWORD || "",
      process.env.RABBITMQ_VHOST || "",
    );
  },
});

container.register("subscriber", {
  useClass: SendNotificationManagerOnLeaveRequestCreated,
});
container.register("subscriber", {
  useClass: SendNotificationEmployeeOnLeaveRequestRejected,
});
container.register("subscriber", {
  useClass: SendNotificationEmployeeOnLeaveRequestApproved,
});
container.register("subscriber", {
  useClass: DeductDaysEmployeeOnLeaveRequestApproved,
});
container.register(ResendConnection, {
  useFactory: () => {
    return new ResendConnection(process.env.RESEND_API_KEY || "");
  },
});
container.register(RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN, {
  useClass: ResendEmailNotificationEmail,
});
