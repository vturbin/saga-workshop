import { Logger } from '@nestjs/common';
import { CheckItemsAvailabilityState } from './check-items-availability.state';
import { PlaceOrderSagaState } from './place-order.state';
import { ProcessPaymentState } from './process-payment.state';
import {
  OrderRoutingKey,
  ReserveItemsResponseDto,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';

export class ReserveItemsState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${ReserveItemsState.name}`);

    const response = await this.saga.amqpConnection.request<
      RpcResponse<ReserveItemsResponseDto>
    >({
      exchange: orderExchange,
      routingKey: OrderRoutingKey.ReserveItems,
      payload: this.saga.placeOrderDto.items,
      timeout: 15000,
    });
    const reserveItemsResponse = handleRpcResponse(response);

    this.saga.setState(
      new ProcessPaymentState(reserveItemsResponse.totalAmount)
    );
    await this.saga.getState().execute();
  }

  public async compensate(): Promise<void> {
    Logger.debug(`Compensating ${ReserveItemsState.name}`);
    const response = await this.saga.amqpConnection.request<RpcResponse<void>>({
      exchange: orderExchange,
      routingKey: OrderRoutingKey.CancelItemsReservation,
      payload: this.saga.placeOrderDto.items,
      timeout: 15000,
    });
    handleRpcResponse(response);

    this.saga.setState(new CheckItemsAvailabilityState());
    await this.saga.getState().compensate();
  }
}
