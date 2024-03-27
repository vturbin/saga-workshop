import { PlaceOrderSagaState } from './place-order.state';
import { BadRequestException, Logger } from '@nestjs/common';
import { ReserveItemsState } from './reserve-items.state';
import {
  CheckItemsAvailabilityResponseDto,
  OrderRoutingKey,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';

export class CheckItemsAvailabilityState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${CheckItemsAvailabilityState.name}`);
    const response = await this.saga.amqpConnection.request<
      RpcResponse<CheckItemsAvailabilityResponseDto>
    >({
      exchange: orderExchange,
      routingKey: OrderRoutingKey.CheckItemsAvailability,
      payload: this.saga.placeOrderDto.items,
      timeout: 15000,
    });
    const availability = handleRpcResponse(response);

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
