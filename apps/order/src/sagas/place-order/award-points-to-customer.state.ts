import {
  AssignLoyaltyPointsRequestDto,
  OrderRoutingKey,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { Logger } from '@nestjs/common';

export class AwardPointsToCustomerState extends PlaceOrderSagaState {
  public constructor(private paidAmount: number) {
    super();
  }
  public async execute(): Promise<void> {
    try {
      Logger.debug(`Executing ${AwardPointsToCustomerState.name}`);

      const assignLoyaltyPoints: AssignLoyaltyPointsRequestDto = {
        paidAmount: this.paidAmount,
        userId: this.saga.placeOrderDto.customerId,
      };
      const response = await this.saga.amqpConnection.request<
        RpcResponse<AssignLoyaltyPointsRequestDto>
      >({
        exchange: orderExchange,
        routingKey: OrderRoutingKey.AwardPoints,
        payload: assignLoyaltyPoints,
        timeout: 15000,
      });
      handleRpcResponse(response);
    } catch (error) {
      // Do we actually need to revert the whole operation if points were not awarded to the customer?
      Logger.debug(error);
    }
  }
  public compensate(): Promise<void> {
    Logger.debug(
      `No compensation action for ${AwardPointsToCustomerState.name}`
    );
    return;
  }
}
