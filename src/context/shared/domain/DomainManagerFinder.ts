import { Manager } from "../../manager/domain/Manager";
import { ManagerRepository } from "../../manager/domain/ManagerRepository";
import { ManagerId } from "./ManagerId";
export class DomainManagerFinder {
  constructor(private readonly repository: ManagerRepository) {}

  async find(id: string): Promise<Manager | null> {
    const manager = await this.repository.search(new ManagerId(id));
    return manager;
  }
}
