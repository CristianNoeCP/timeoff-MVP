import { ManagerId } from "../domain/ManagerId";
import { ManagerNotFoundError } from "../domain/ManagerNotFoundError";
import { ManagerRepository } from "../domain/ManagerRepository";

export class ManagerFinder {
  constructor(private readonly repository: ManagerRepository) {}

  async run(id: string) {
    const manager = await this.repository.search(new ManagerId(id));
    if (!manager) {
      throw new ManagerNotFoundError(id);
    }
    return manager.toPrimitives();
  }
}
