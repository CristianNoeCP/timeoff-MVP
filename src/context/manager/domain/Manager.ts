import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { Primitives } from "@codelytv/primitives-type";
import { ManagerId } from "./ManagerId";
import { ManagerEmail } from "./ManagerEmail";
import { ManagerName } from "./ManagerName";


export class Manager extends AggregateRoot {
  private constructor(
    readonly id: ManagerId,
    readonly name: ManagerName,
    readonly email: ManagerEmail,
  ) {
    super();
  }

  static fromPrimitives(primitives: Primitives<Manager>): Manager {
    return new Manager(
      new ManagerId(primitives.id),
      new ManagerName(primitives.name),
      new ManagerEmail(primitives.email),
    );
  }

  static create(id: string, name: string, email: string): Manager {
    return Manager.fromPrimitives({ id, name, email });
  }

  toPrimitives(): Primitives<Manager> {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
    };
  }
}
