import { Injectable, Logger } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { SagaTempData } from './place-order.saga';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  OrderRoutingKey,
  RpcResponse,
  awardPointsResponseQueue,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';

@Injectable()
export class AwardPointsToCustomerState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(AwardPointsToCustomerState.name);
  }
  public async execute(orderId: string): Promise<void> {
    const tempData: SagaTempData = this.saga.tempData.get(orderId);

    const packageItemsRequestDto: AssignLoyaltyPointsRequestDto = {
      paidAmount: tempData.paidAmount,
      userId: tempData.placeOrderDto.customerId,
      orderId,
    };

    this.amqpConnection.publish<AssignLoyaltyPointsRequestDto>(
      orderExchange,
      OrderRoutingKey.AwardPoints,
      packageItemsRequestDto
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async compensate(_orderId: string): Promise<void> {
    Logger.debug(
      `No compensation action for ${AwardPointsToCustomerState.name}`
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.AwardPointsResponse,
    queue: awardPointsResponseQueue,
  })
  public async handleAwardPointsResponse(
    response: RpcResponse<AssignLoyaltyPointsResponseDto>
  ): Promise<void> {
    try {
      const assignLoyaltyPointsResponseDto = handleRpcResponse(response);
      Logger.debug(assignLoyaltyPointsResponseDto);
      // TODO: Send SSE to user that order has been finished and amount of assigned points to customer
    } catch (error) {
      // We don't want to reverse whole operation only if points were not awarded to customer
      Logger.debug(error);
    }
    this.saga.executeNextStep(this.name, response.data.orderId);
  }
}
