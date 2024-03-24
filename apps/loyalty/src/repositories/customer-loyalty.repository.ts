import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoGenericRepository, UnitOfWork } from '@nest-shared';
import { CustomerLoyalty } from '../models/customer-loyalty.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerLoyaltyRepository extends MongoGenericRepository<CustomerLoyalty> {
  public constructor(
    @InjectModel(CustomerLoyalty.name)
    private collection: Model<CustomerLoyalty>,
    private unitOfWork: UnitOfWork
  ) {
    super(collection);
  }

  public async addLoyaltyPoints(
    userId: string,
    pointsToAdd: number
  ): Promise<CustomerLoyalty> {
    await this.unitOfWork.start();
    const updatedDocument = await this.collection
      .findOneAndUpdate(
        { userId: userId },
        { $inc: { points: pointsToAdd } },
        { new: true } // Return the updated document
      )
      .lean()
      .session(this.unitOfWork.session)
      .exec();
    if (updatedDocument) {
      Logger.debug('Updated document:', updatedDocument);
      await this.unitOfWork.commit();
      return updatedDocument;
    } else {
      Logger.debug('No document found with the specified userId');
      throw new NotFoundException(
        'No document with the specified userId found'
      );
    }
  }
}
