import { PlaceOrderSagaState } from './place-order.state';
import { Injectable, Logger } from '@nestjs/common';
import {
  CheckItemsAvailabilityResponseDto,
  OrderItemsRequestDto,
  OrderRoutingKey,
  RpcResponse,
  checkItemsResponseQueue,
  handleRpcResponse,
  orderExchange,
} from '@nest-shared';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class CheckItemsAvailabilityState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(CheckItemsAvailabilityState.name);
  }

  public async execute(orderId: string): Promise<void> {
    const tempData = this.saga.tempData.get(orderId);
    Logger.debug(`Executing ${CheckItemsAvailabilityState.name}`);
    const orderItemsRequestDto: OrderItemsRequestDto = {
      orderId,
      items: tempData.placeOrderDto.items,
    };
    this.amqpConnection.publish<OrderItemsRequestDto>(
      orderExchange,
      OrderRoutingKey.CheckItemsAvailability,
      orderItemsRequestDto
    );
  }

  public async compensate(orderId: string): Promise<void> {
    Logger.debug(
      `No compensation action for ${CheckItemsAvailabilityState.name}`
    );
    this.saga.compensatePreviousStep(this.name, orderId);
    return;
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CheckItemsAvailabilityResponse,
    queue: checkItemsResponseQueue,
  })
  public async handleCheckItemsAvailabilityResponse(
    response: RpcResponse<CheckItemsAvailabilityResponseDto>
  ): Promise<void> {
    try {
      const processPaymentResponseDto = handleRpcResponse(response);

      if (!processPaymentResponseDto.allItemsAvailable) {
        const responseToClient: RpcResponse<CheckItemsAvailabilityResponseDto> =
          {
            success: false,
            error: {
              statusCode: 400,
              message: 'Unfortunately some items are unavailable',
            },
          };
        // TODO: respond to client with SSE
        Logger.debug(responseToClient);
        this.saga.compensatePreviousStep(this.name, response.data.orderId);
        return;
      }
      this.saga.executeNextStep(this.name, response.data.orderId);
    } catch (error) {
      // TODO: respond to client with SSE
      Logger.debug(response);
      this.saga.compensatePreviousStep(this.name, response.data.orderId);
    }
  }
}
