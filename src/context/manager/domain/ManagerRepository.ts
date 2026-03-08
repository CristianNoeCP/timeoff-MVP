import { Manager } from "./Manager";
import { ManagerId } from "../../shared/domain/ManagerId";

export interface ManagerRepository {
  save(manager: Manager): Promise<void>;
  search(id: ManagerId): Promise<Manager | null>;
}
