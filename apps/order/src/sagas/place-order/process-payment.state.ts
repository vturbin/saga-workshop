import { RefundPaymentDto } from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { Logger } from '@nestjs/common';

export class ProcessPaymentState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    try {
      Logger.debug(`Executing ${ProcessPaymentState.name}`);
      const paymentDetails = {
        ...this.saga.placeOrderDto.paymentDetails,
        amount: this.saga.paidAmount,
      };
      const processPaymentResult = await this.saga.paymentClient.processPayment(
        paymentDetails
      );
      this.saga.paymentId = processPaymentResult.paymentId;
    } catch (error) {
      Logger.debug(`${ProcessPaymentState.name} failed`);
      throw error;
    }
  }
  public async compensate(): Promise<void> {
    Logger.debug(`Compensating ${ProcessPaymentState.name}`);

    const refundPaymentDto: RefundPaymentDto = {
      paymentId: this.saga.paymentId,
    };
    await this.saga.paymentClient.refundPayment(refundPaymentDto);
  }
}
