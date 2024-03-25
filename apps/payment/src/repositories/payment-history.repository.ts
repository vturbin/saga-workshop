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
    processPayment: ProcessPaymentDto
  ): Promise<PaymentHistorySchema> {
    await this.unitOfWork.start();
    const paymentHistorySchema: PaymentHistorySchema = {
      paymentMethod: processPayment.method,
      paymentId: uuid(),
      paymentStatus: PaymentStatus.Completed,
      amount: processPayment.amount,
      date: new Date(),
    };
    const [paymentHistory] = await this.collection.create(
      [paymentHistorySchema],
      {
        session: this.unitOfWork.session,
      }
    );
    await this.unitOfWork.commit();
    return paymentHistory;
  }

  public async refundPayment(paymentId: string): Promise<void> {
    await this.unitOfWork.start();
    try {
      const payments = await this.collection.find({ paymentId }).lean().exec();
      if (!payments.length) {
        throw new BadRequestException(
          `Payments with id ${paymentId} not found!`
        );
      }
      const refundedPayment = payments.filter(
        (payment) => payment.paymentStatus === PaymentStatus.Refunded
      );
      if (refundedPayment.length) {
        throw new BadRequestException(
          `Payment with id ${paymentId} has already been refunded`
        );
      }
      const payment = payments[0];
      const paymentHistorySchema: PaymentHistorySchema = {
        paymentMethod: payment.paymentMethod,
        paymentId: payment.paymentId,
        paymentStatus: PaymentStatus.Refunded,
        amount: payment.amount,
        date: new Date(),
      };
      await this.collection.create([paymentHistorySchema], {
        session: this.unitOfWork.session,
      });
      await this.unitOfWork.commit();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed update payment status in the history',
        error.message
      );
    }
  }
}
