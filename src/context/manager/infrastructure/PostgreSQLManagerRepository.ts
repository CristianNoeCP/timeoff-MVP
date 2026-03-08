import { injectable, InjectionToken } from "tsyringe";
import { PostgresRepository } from "../../shared/infrastructure/PostgresRepository";
import { ManagerRepository } from "../domain/ManagerRepository";
import { Manager } from "../domain/Manager";
import { ManagerId } from "../../shared/domain/ManagerId";

export const MANAGER_REPO_TOKEN: InjectionToken<ManagerRepository> =
  "ManagerRepository";

type DatabaseManagerRow = {
  id: string;
  name: string;
  email: string;
};

@injectable()
export class PostgreSQLManagerRepository
  extends PostgresRepository<Manager>
  implements ManagerRepository
{
  async save(manager: Manager): Promise<void> {
    const primitives = manager.toPrimitives();
    await this.execute`
      INSERT INTO managers (id, name, email)
      VALUES (
        ${primitives.id},
        ${primitives.name},
        ${primitives.email}
      )
    `;
  }

  async search(id: ManagerId): Promise<Manager | null> {
    return await this.searchOne`
      SELECT id, name, email
      FROM managers
      WHERE id = ${id.value};
    `;
  }

  protected toAggregate(row: DatabaseManagerRow): Manager {
    return Manager.fromPrimitives({
      id: row.id,
      name: row.name,
      email: row.email,
    });
  }
}
