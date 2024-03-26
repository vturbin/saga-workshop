import { PlaceOrderSagaState } from './place-order.state';
import { BadRequestException, Logger } from '@nestjs/common';
import { ReserveItemsState } from './reserve-items.state';

export class CheckItemsAvailabilityState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${CheckItemsAvailabilityState.name}`);

    const availability = await this.saga.warehouseClient.checkItemsAvailability(
      this.saga.placeOrderDto.items
    );
    if (!availability.allItemsAvailable) {
      throw new BadRequestException('Unfortunately some items are unavailable');
    }
    this.saga.setState(new ReserveItemsState());
    await this.saga.getState().execute();
  }

  public compensate(): Promise<void> {
    Logger.debug(
      `No compensation action for ${CheckItemsAvailabilityState.name}`
    );
    return;
  }
}
