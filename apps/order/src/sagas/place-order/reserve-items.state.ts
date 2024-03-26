import { Logger } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';

export class ReserveItemsState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${ReserveItemsState.name}`);

    try {
      const reserveItemsResponse = await this.saga.warehouseClient.reserveItems(
        this.saga.placeOrderDto.items
      );
      this.saga.paidAmount = reserveItemsResponse.totalAmount;
    } catch (error) {
      Logger.debug(`${ReserveItemsState.name} failed`);
      throw error;
    }
  }

  public async compensate(): Promise<void> {
    Logger.debug(`Compensating ${ReserveItemsState.name}`);
    await this.saga.warehouseClient.cancelItemsReservation(
      this.saga.placeOrderDto.items
    );
  }
}
