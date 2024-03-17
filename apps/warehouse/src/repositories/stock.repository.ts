import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoGenericRepository, UnitOfWork } from '@nest-shared';
import { Model } from 'mongoose';
import { StockSchema } from '../models/stock.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StockRepository extends MongoGenericRepository<StockSchema> {
  public constructor(
    @InjectModel(StockSchema.name)
    private collection: Model<StockSchema>,
    private unitOfWork: UnitOfWork
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

  public async reserveItems(
    requestedItems: Map<string, number>
  ): Promise<void> {
    this.unitOfWork.start();
    try {
      for (const [itemId, quantity] of requestedItems.entries()) {
        const itemSchema = await this.collection
          .findOne({ itemId })
          .session(this.unitOfWork.session)
          .exec();
        if (itemSchema) {
          const availableForReservation =
            itemSchema.currentStock - itemSchema.reservedAmount;
          if (availableForReservation >= quantity) {
            itemSchema.reservedAmount += quantity;
            itemSchema.save({ session: this.unitOfWork.session });
          } else {
            throw new Error(`Insufficient stock for item ${itemId}`);
          }
        } else {
          throw new Error(`Item with id ${itemId} was not found`);
        }
      }
      this.unitOfWork.commit();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to reserve items',
        error.message
      );
    }
  }

  public async cancelItemsReservation(
    requestedItems: Map<string, number>
  ): Promise<void> {
    this.unitOfWork.start();
    try {
      for (const [itemId, quantity] of requestedItems.entries()) {
        const itemSchema = await this.collection
          .findOne({ itemId })
          .session(this.unitOfWork.session)
          .exec();
        if (itemSchema) {
          itemSchema.reservedAmount =
            itemSchema.reservedAmount <= quantity
              ? 0
              : itemSchema.reservedAmount - quantity;
          itemSchema.save({ session: this.unitOfWork.session });
        } else {
          throw new Error(`Item with id ${itemId} was not found`);
        }
      }
      this.unitOfWork.commit();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to cancel items reservation',
        error.message
      );
    }
  }
}
