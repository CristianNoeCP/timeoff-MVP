
export abstract class NotificationEmail {
	abstract send(to:string, subject: string, template?: string): Promise<void>;
}
