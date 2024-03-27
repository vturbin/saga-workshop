import {
  OrderRoutingKey,
  PackageItemsRequestDto,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { ProcessPaymentState } from './process-payment.state';
import { AwardPointsToCustomerState } from './award-points-to-customer.state';
import { Logger } from '@nestjs/common';

export class PackageItemsState extends PlaceOrderSagaState {
  constructor(private paymentId?: string, private paidAmount?: number) {
    super();
  }

  public async execute(): Promise<void> {
    Logger.debug(`Executing ${PackageItemsState.name}`);

    const packageItemsDto: PackageItemsRequestDto = {
      items: this.saga.placeOrderDto.items,
      shippingAddress: this.saga.placeOrderDto.shippingAddress,
    };
    try {
      const response = await this.saga.amqpConnection.request<
        RpcResponse<void>
      >({
        exchange: orderExchange,
        routingKey: OrderRoutingKey.PackageItems,
        payload: packageItemsDto,
        timeout: 15000,
      });
      handleRpcResponse(response);

      this.saga.setState(new AwardPointsToCustomerState(this.paidAmount));
    } catch (error) {
      Logger.debug(`${PackageItemsState.name} failed`);

      this.saga.setState(new ProcessPaymentState(null, this.paymentId));
      await this.saga.getState().compensate();
      throw error;
    }
    await this.saga.getState().execute();
  }
  public compensate(): Promise<void> {
    Logger.debug(`No compensation action for ${PackageItemsState.name}`);
    return;
  }
}
