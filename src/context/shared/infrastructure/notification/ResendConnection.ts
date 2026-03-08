
import { Resend } from "resend";

export class ResendConnection {
  public readonly resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }
}
