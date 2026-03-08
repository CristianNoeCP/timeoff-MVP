import { Manager } from "../domain/Manager";
import { ManagerRepository } from "../domain/ManagerRepository";

export class ManagerCreator {
  constructor(private readonly repository: ManagerRepository) {}

  async run(id: string, name: string, email: string): Promise<void> {
    const manager = Manager.create(id, name, email);
    await this.repository.save(manager);
  }
}
