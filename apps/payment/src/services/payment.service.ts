import { PaymentIdDto, PaymentMethod, ProcessPaymentDto } from '@nest-shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentHistoryRepository } from '../repositories/payment-history.repository';

@Injectable()
export class PaymentService {
  constructor(private paymentHistoryRepository: PaymentHistoryRepository) {}

  public async processPayment(
    processPaymentDetails: ProcessPaymentDto
  ): Promise<PaymentIdDto> {
    if (processPaymentDetails.method !== PaymentMethod.PayPal) {
      throw new BadRequestException('Currently only Paypal is supported!');
    }
    this.someFancyPaymentOperationsWithPaymentGateway();

    const paymentHistory = await this.paymentHistoryRepository.createEntry(
      processPaymentDetails
    );
    const paymentId: PaymentIdDto = { paymentId: paymentHistory.paymentId };
    return paymentId;
  }

  public async refundPayment(paymentId: string): Promise<void> {
    this.refundOperationWithPaymentGateway(paymentId);
    await this.paymentHistoryRepository.updatePaymentStatus(paymentId);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private someFancyPaymentOperationsWithPaymentGateway(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  private refundOperationWithPaymentGateway(_paymentId: string): void {}
}
