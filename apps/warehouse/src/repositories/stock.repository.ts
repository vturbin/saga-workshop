import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MongoGenericRepository } from '@nest-shared';
import { Model } from 'mongoose';
import { StockSchema } from '../models/stock.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StockRepository extends MongoGenericRepository<StockSchema> {
  public constructor(
    @InjectModel(StockSchema.name)
    private collection: Model<StockSchema>
  ) {
    super(collection);
  }

  public async getItemsInStock(itemIds: string[]): Promise<StockSchema[]> {
    try {
      return this.collection
        .find({ itemId: { $in: itemIds } })
        .lean()
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve items from the database'
      );
    }
  }
}
