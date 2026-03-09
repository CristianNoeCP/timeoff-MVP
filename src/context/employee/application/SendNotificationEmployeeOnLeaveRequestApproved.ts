import { inject, injectable } from "tsyringe";
import { DomainEventClass } from "../../shared/domain/DomainEventClass";
import { DomainEventSubscriber } from "../../shared/domain/DomainEventSubscriber";
import { LeaveRequestApprovedDomainEvent } from "../../leaveRequest/domain/LeaveRequestApprovedDomainEvent";
import {
  RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN,
  ResendEmailNotificationEmail,
} from "../../shared/infrastructure/notification/ResendEmailNotificationEmail";
import { EmployeeRepository } from "../domain/EmployeeRepository";
import { EMPLOYEE_REPO_TOKEN } from "../infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeNotification } from "./EmployeeNotification";

@injectable()
export class SendNotificationEmployeeOnLeaveRequestApproved implements DomainEventSubscriber<LeaveRequestApprovedDomainEvent> {
  private employeeNotification: EmployeeNotification;
  constructor(
    @inject(RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN)
    private resendEmailNotificationEmail: ResendEmailNotificationEmail,
    @inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository,
  ) {
    this.employeeNotification = new EmployeeNotification(
      this.resendEmailNotificationEmail,
      this.employeeRepository,
    );
  }
  async on(event: LeaveRequestApprovedDomainEvent): Promise<void> {
    await this.employeeNotification.notify(
      event.daysDeducted,
      event.employeeId,
      event.status,
    );
  }

  subscribedTo(): DomainEventClass[] {
    return [LeaveRequestApprovedDomainEvent];
  }

  name(): string {
    return "company.send_email_employee_on_leave_request_approval";
  }
}
