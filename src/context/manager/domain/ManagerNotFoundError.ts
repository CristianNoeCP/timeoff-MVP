export class ManagerNotFoundError extends Error {
  readonly name = "ManagerNotFoundError";

  constructor(id: string) {
    super(`Manager with id <${id}> not found`);
  }
}
