import { Logger } from '@nestjs/common';
import { CheckItemsAvailabilityState } from './check-items-availability.state';
import { PlaceOrderSagaState } from './place-order.state';
import { ProcessPaymentState } from './process-payment.state';

export class ReserveItemsState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${ReserveItemsState.name}`);

    const reserveItemsResponse = await this.saga.warehouseClient.reserveItems(
      this.saga.placeOrderDto.items
    );
    this.saga.setState(
      new ProcessPaymentState(reserveItemsResponse.totalAmount)
    );
    await this.saga.getState().execute();
  }

  public async compensate(): Promise<void> {
    Logger.debug(`Compensating ${ReserveItemsState.name}`);
    await this.saga.warehouseClient.cancelItemsReservation(
      this.saga.placeOrderDto.items
    );
    this.saga.setState(new CheckItemsAvailabilityState());
    await this.saga.getState().compensate();
  }
}
