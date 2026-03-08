import { inject, injectable } from "tsyringe";
import { LeaveRequestCreatedDomainEvent } from "../../leaveRequest/domain/LeaveRequestCreatedDomainEvent";
import { DomainEventClass } from "../../shared/domain/DomainEventClass";
import { DomainEventSubscriber } from "../../shared/domain/DomainEventSubscriber";
import { ManagerNotification } from "./ManagerNotification";
import {
  RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN,
  ResendEmailNotificationEmail,
} from "../../shared/infrastructure/notification/ResendEmailNotificationEmail";

@injectable()
export class SendNotificationManagerOnLeaveRequestCreated implements DomainEventSubscriber<LeaveRequestCreatedDomainEvent> {
  private managerNotification: ManagerNotification;
  constructor(
    @inject(RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN)
    private resendEmailNotificationEmail: ResendEmailNotificationEmail,
  ) {
    this.managerNotification = new ManagerNotification(
      this.resendEmailNotificationEmail,
    );
  }

  async on(event: LeaveRequestCreatedDomainEvent): Promise<void> {
    await this.managerNotification.notify();
  }

  subscribedTo(): DomainEventClass[] {
    return [LeaveRequestCreatedDomainEvent];
  }

  name(): string {
    return "company.send_email_manager_on_leave_request_created";
  }
}
