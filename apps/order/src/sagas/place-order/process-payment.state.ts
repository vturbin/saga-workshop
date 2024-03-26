import { RefundPaymentDto } from '@nest-shared';
import { PackageItemsState } from './package-items.state';
import { PlaceOrderSagaState } from './place-order.state';
import { ReserveItemsState } from './reserve-items.state';
import { Logger } from '@nestjs/common';

export class ProcessPaymentState extends PlaceOrderSagaState {
  public constructor(private totalAmount?: number, private paymentId?: string) {
    super();
  }

  public async execute(): Promise<void> {
    try {
      Logger.debug(`Executing ${ProcessPaymentState.name}`);
      const paymentDetails = {
        ...this.saga.placeOrderDto.paymentDetails,
        amount: this.totalAmount,
      };
      const processPaymentResult = await this.saga.paymentClient.processPayment(
        paymentDetails
      );
      this.saga.setState(
        new PackageItemsState(processPaymentResult.paymentId, this.totalAmount)
      );
    } catch (error) {
      Logger.debug(`${ProcessPaymentState.name} failed`);
      this.saga.setState(new ReserveItemsState());
      await this.saga.getState().compensate();
      throw error;
    }
    await this.saga.getState().execute();
  }
  public async compensate(): Promise<void> {
    Logger.debug(`Compensating ${ProcessPaymentState.name}`);

    const refundPaymentDto: RefundPaymentDto = {
      paymentId: this.paymentId,
    };
    await this.saga.paymentClient.refundPayment(refundPaymentDto);
    this.saga.setState(new ReserveItemsState());
    await this.saga.getState().compensate();
  }
}
