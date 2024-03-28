import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { SagaTempData } from './place-order.saga';
import {
  OrderIdDto,
  OrderRoutingKey,
  PackageItemsRequestDto,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
  packageItemsResponseQueue,
} from '@nest-shared';

@Injectable()
export class PackageItemsState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(PackageItemsState.name);
  }

  public async execute(orderId: string): Promise<void> {
    Logger.debug(`Executing ${PackageItemsState.name}`);
    const tempData: SagaTempData = this.saga.tempData.get(orderId);

    const packageItemsRequestDto: PackageItemsRequestDto = {
      items: tempData.placeOrderDto.items,
      shippingAddress: tempData.placeOrderDto.shippingAddress,
      orderId,
    };

    this.amqpConnection.publish<PackageItemsRequestDto>(
      orderExchange,
      OrderRoutingKey.PackageItems,
      packageItemsRequestDto
    );
  }

  public async compensate(orderId: string): Promise<void> {
    Logger.debug(`No compensation action for ${PackageItemsState.name}`);
    this.saga.compensatePreviousStep(this.name, orderId);
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.PackageItemsResponse,
    queue: packageItemsResponseQueue,
  })
  public async handlePackageItemsResponse(
    response: RpcResponse<OrderIdDto>
  ): Promise<void> {
    try {
      const orderIdDto = handleRpcResponse(response);
      this.saga.executeNextStep(this.name, orderIdDto.orderId);
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
}
