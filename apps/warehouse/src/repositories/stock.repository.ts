import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    const items = await this.collection
      .find({ itemId: { $in: itemIds } })
      .lean()
      .exec();
    if (!items.length) {
      throw new NotFoundException('Items with following ids not found');
    }
    return items;
  }

  public async reserveItems(
    requestedItems: Map<string, number>
  ): Promise<number> {
    await this.unitOfWork.start();

    let total = 0;
    for (const [itemId, quantity] of requestedItems.entries()) {
      const itemSchema = await this.collection.findOne({ itemId }).exec();
      if (itemSchema) {
        const availableForReservation =
          itemSchema.currentStock - itemSchema.reservedAmount;
        if (availableForReservation >= quantity) {
          itemSchema.reservedAmount += quantity;
          itemSchema.save({ session: this.unitOfWork.session });
          total = total + itemSchema.price * quantity;
        } else {
          throw new BadRequestException(
            `Insufficient stock for item ${itemId}`
          );
        }
      } else {
        throw new NotFoundException(`Item with id ${itemId} was not found`);
      }
    }
    await this.unitOfWork.commit();
    return total;
  }

  public async updateItemsInStock(
    requestedItems: Map<string, number>
  ): Promise<void> {
    await this.unitOfWork.start();

    for (const [itemId, quantity] of requestedItems.entries()) {
      const itemSchema = await this.collection
        .findOne({ itemId })
        .session(this.unitOfWork.session)
        .exec();
      if (itemSchema) {
        itemSchema.reservedAmount -= quantity;
        itemSchema.currentStock -= quantity;
        await itemSchema.save({ session: this.unitOfWork.session });
      } else {
        throw new NotFoundException(`Item with id ${itemId} was not found`);
      }
    }
    await this.unitOfWork.commit();
  }

  public async cancelItemsReservation(
    requestedItems: Map<string, number>
  ): Promise<void> {
    await this.unitOfWork.start();
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
        await itemSchema.save({ session: this.unitOfWork.session });
      } else {
        throw new NotFoundException(`Item with id ${itemId} was not found`);
      }
    }
    await this.unitOfWork.commit();
  }
}
