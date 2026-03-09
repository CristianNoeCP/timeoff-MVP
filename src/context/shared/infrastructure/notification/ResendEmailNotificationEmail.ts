import { Resend } from "resend";
import { NotificationEmail } from "../../domain/NotificationEmail";
import { inject, injectable, InjectionToken } from "tsyringe";
import { ResendConnection } from "./ResendConnection";
export const RESEND_EMAIL_NOTIFICATION_EMAIL_TOKEN: InjectionToken<ResendEmailNotificationEmail> =
  "ResendEmailNotificationEmail";
@injectable()
export class ResendEmailNotificationEmail implements NotificationEmail {
  private resend: Resend;
  constructor(@inject(ResendConnection) connection: ResendConnection) {
    this.resend = connection.resend;
  }
  async send(to: string, subject: string, template?: string): Promise<void> {
    await this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html: template || "<strong>Mi primer correo</strong>",
    });
  }
}
