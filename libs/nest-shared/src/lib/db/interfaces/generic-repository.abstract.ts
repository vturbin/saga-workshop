export abstract class IGenericRepository<T> {
  public abstract getAll(): Promise<T[]>;

  public abstract get(id: string): Promise<T | null>;

  public abstract create(item: T): Promise<T>;

  public abstract update(id: string, item: Partial<T>): Promise<T | null>;

  public abstract findBy(property: { [K in keyof T]?: unknown }): Promise<T[]>;

  public abstract findOneBy(property: {
    [K in keyof T]?: unknown;
  }): Promise<T | null>;
}
