import {
  MongoGenericRepository,
  ProcessPaymentDto,
  UnitOfWork,
} from '@nest-shared';
import { PaymentHistorySchema } from '../models/payment-history.schema';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentHistoryRepository extends MongoGenericRepository<PaymentHistorySchema> {
  public constructor(
    @InjectModel(PaymentHistorySchema.name)
    private collection: Model<PaymentHistorySchema>,
    private unitOfWork: UnitOfWork
  ) {
    super(collection);
  }

  public async createEntry(
    item: ProcessPaymentDto
  ): Promise<PaymentHistorySchema> {
    await this.unitOfWork.start();
    const paymentHistorySchema: PaymentHistorySchema = {
      paymentMethod: item.method,
      paymentId: uuid(),
      paymentStatus: PaymentStatus.Completed,
      amount: item.amount,
      date: new Date(),
    };
    try {
      const [paymentHistory] = await this.collection.create(
        paymentHistorySchema,
        {
          session: this.unitOfWork.session,
        }
      );
      await this.unitOfWork.commit();
      return paymentHistory;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create payment history entry',
        error.message
      );
    }
  }

  public async updatePaymentStatus(paymentId: string): Promise<void> {
    await this.unitOfWork.start();
    try {
      const payment = await this.collection.findOne({ paymentId }).exec();
      if (!payment) {
        throw new BadRequestException(
          `Payment with id ${paymentId} not found!`
        );
      }
      payment.paymentStatus = PaymentStatus.Refunded;
      payment.save({ session: this.unitOfWork.session });

      await this.unitOfWork.commit();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed update payment status in the history',
        error.message
      );
    }
  }
}
