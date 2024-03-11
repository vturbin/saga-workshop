import { Model } from 'mongoose';
import { IGenericRepository } from '../interfaces/generic-repository.abstract';

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private repository: Model<T>;

  public constructor(repository: Model<T>) {
    this.repository = repository;
  }

  public async getAll(): Promise<T[]> {
    return this.repository.find().exec();
  }

  public async get(id: string): Promise<T | null> {
    return this.repository.findById(id).exec();
  }

  public async create(item: T): Promise<T> {
    return this.repository.create(item);
  }

  public async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.repository.findByIdAndUpdate(id, item).exec();
  }

  public async findBy(property: { [K in keyof T]?: unknown }): Promise<T[]> {
    return this.repository.find(property).exec();
  }

  public async findOneBy(property: {
    [K in keyof T]?: unknown;
  }): Promise<T | null> {
    return this.repository.findOne(property).exec();
  }
}
