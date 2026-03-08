import { NotificationEmail } from "../../shared/domain/NotificationEmail";

export class ManagerNotification {
  constructor(private readonly notificationEmail: NotificationEmail) {}

  async notify(to?: string, subject?: string): Promise<void> {
    await this.notificationEmail.send(
      to ?? "manager@company.com",
      subject ?? "New leave request created",
    );
  }
}
