import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import {
  OrderIdDto,
  OrderItemsRequestDto,
  OrderRoutingKey,
  ReserveItemsForOrderResponseDto,
  RpcResponse,
  cancelItemsReservationResponseQueue,
  handleRpcResponse,
  orderExchange,
  reserveItemsResponseQueue,
} from '@nest-shared';
import { SagaTempData } from './place-order.saga';

@Injectable()
export class ReserveItemsState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(ReserveItemsState.name);
  }

  public async execute(orderId: string): Promise<void> {
    const tempData = this.saga.tempData.get(orderId);
    Logger.debug(`Executing ${ReserveItemsState.name}`);

    const orderItemsRequestDto: OrderItemsRequestDto = {
      orderId,
      items: tempData.placeOrderDto.items,
    };
    this.amqpConnection.publish<OrderItemsRequestDto>(
      orderExchange,
      OrderRoutingKey.ReserveItems,
      orderItemsRequestDto
    );
  }

  public async compensate(orderId: string): Promise<void> {
    const tempData = this.saga.tempData.get(orderId);

    Logger.debug(`Compensating ${ReserveItemsState.name}`);
    const orderItemsRequestDto: OrderItemsRequestDto = {
      orderId,
      items: tempData.placeOrderDto.items,
    };
    this.amqpConnection.publish<OrderItemsRequestDto>(
      orderExchange,
      OrderRoutingKey.CancelItemsReservation,
      orderItemsRequestDto
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ReserveItemsResponse,
    queue: reserveItemsResponseQueue,
  })
  public async handleReserveItemsResponse(
    response: RpcResponse<ReserveItemsForOrderResponseDto>
  ): Promise<void> {
    try {
      const reserveItemsForOrderResponseDto = handleRpcResponse(response);
      let tempData: SagaTempData = this.saga.tempData.get(
        reserveItemsForOrderResponseDto.orderId
      );
      tempData = {
        ...tempData,
        paidAmount: reserveItemsForOrderResponseDto.totalAmount,
      };
      this.saga.tempData.set(reserveItemsForOrderResponseDto.orderId, tempData);

      this.saga.executeNextStep(
        this.name,
        reserveItemsForOrderResponseDto.orderId
      );
    } catch (error) {
      const responseToClient: RpcResponse<OrderIdDto> = {
        success: false,
        error: {
          statusCode: (error as HttpException).getStatus(),
          message: (error as HttpException).getResponse() as string,
        },
      };
      // TODO: respond to client with SSE
      Logger.debug(responseToClient);
      this.saga.compensatePreviousStep(this.name, response.data.orderId);
    }
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CancelItemsReservationResponse,
    queue: cancelItemsReservationResponseQueue,
  })
  public async handleCancelItemsReservationResponse(
    response: RpcResponse<OrderIdDto>
  ): Promise<void> {
    this.saga.compensatePreviousStep(this.name, response.data.orderId);
  }
}
