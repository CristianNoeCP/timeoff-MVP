import { inject, injectable } from "tsyringe";
import { LeaveRequestCreatedDomainEvent } from "../../leaveRequest/domain/LeaveRequestCreatedDomainEvent";
import { DomainEventClass } from "../../shared/domain/DomainEventClass";
import { DomainEventSubscriber } from "../../shared/domain/DomainEventSubscriber";
import { ManagerNotification } from "./ManagerNotification";
import {
  RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN,
  ResendEmailNotificationEmail,
} from "../../shared/infrastructure/notification/ResendEmailNotificationEmail";
import { ManagerRepository } from "../domain/ManagerRepository";
import { MANAGER_REPO_TOKEN } from "../infrastructure/PostgreSQLManagerRepository";
import { EMPLOYEE_REPO_TOKEN } from "../../employee/infrastructure/PostgreSQLEmployeeRepository";
import { EmployeeRepository } from "../../employee/domain/EmployeeRepository";

@injectable()
export class SendNotificationManagerOnLeaveRequestCreated implements DomainEventSubscriber<LeaveRequestCreatedDomainEvent> {
  private managerNotification: ManagerNotification;
  constructor(
    @inject(RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN)
    private resendEmailNotificationEmail: ResendEmailNotificationEmail,
    @inject(MANAGER_REPO_TOKEN) private managerRepository: ManagerRepository,
    @inject(EMPLOYEE_REPO_TOKEN) private employeeRepository: EmployeeRepository,
  ) {
    this.managerNotification = new ManagerNotification(
      this.resendEmailNotificationEmail,
      this.employeeRepository,
      this.managerRepository,
    );
  }

  async on(event: LeaveRequestCreatedDomainEvent): Promise<void> {
    await this.managerNotification.notify(event.managerId, event.daysDeducted, event.employeeId);
  }

  subscribedTo(): DomainEventClass[] {
    return [LeaveRequestCreatedDomainEvent];
  }

  name(): string {
    return "company.send_email_manager_on_leave_request_created";
  }
}
