import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  CheckItemsAvailabilityResponseDto,
  OrderIdDto,
  OrderItemsRequestDto,
  OrderRoutingKey,
  PackageItemsRequestDto,
  ReserveItemsForOrderResponseDto,
  RpcResponse,
  cancelItemsReservationQueue,
  checkItemsQueue,
  handleRPCServiceCall,
  orderExchange,
  packageItemsQueue,
  reserveItemsQueue,
} from '@nest-shared';
import { WarehouseService } from '../services/warehouse.service';

@Injectable()
export class WarehouseRMQController {
  constructor(
    private warehouseService: WarehouseService,
    private amqpConnection: AmqpConnection
  ) {}

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CheckItemsAvailability,
    queue: checkItemsQueue,
  })
  public async checkItemsAvailability(
    orderItemsRequest: OrderItemsRequestDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.warehouseService.checkItemsAvailability(orderItemsRequest.items)
    );
    if (!response.error) {
      response.data.orderId = orderItemsRequest.orderId;
    }

    this.amqpConnection.publish<RpcResponse<CheckItemsAvailabilityResponseDto>>(
      orderExchange,
      OrderRoutingKey.CheckItemsAvailabilityResponse,
      response
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ReserveItems,
    queue: reserveItemsQueue,
  })
  public async reserveItems(
    orderItemsRequest: OrderItemsRequestDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.warehouseService.reserveItems(orderItemsRequest.items)
    );

    const rpcResponse = {
      ...response,
      data: { ...response.data, orderId: orderItemsRequest.orderId },
    } satisfies RpcResponse<ReserveItemsForOrderResponseDto>;

    this.amqpConnection.publish<RpcResponse<ReserveItemsForOrderResponseDto>>(
      orderExchange,
      OrderRoutingKey.ReserveItemsResponse,
      rpcResponse
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CancelItemsReservation,
    queue: cancelItemsReservationQueue,
  })
  public async cancelItemsReservation(
    orderItemsRequest: OrderItemsRequestDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.warehouseService.cancelItemsReservation(orderItemsRequest.items)
    );
    const rpcResponse: RpcResponse<OrderIdDto> = {
      ...response,
      data: { orderId: orderItemsRequest.orderId },
    };
    this.amqpConnection.publish<RpcResponse<OrderIdDto>>(
      orderExchange,
      OrderRoutingKey.CancelItemsReservationResponse,
      rpcResponse
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.PackageItems,
    queue: packageItemsQueue,
  })
  public async packageItems(
    packageItemsDto: PackageItemsRequestDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.warehouseService.packageItems(
        packageItemsDto.items,
        packageItemsDto.shippingAddress
      )
    );

    const rpcResponse: RpcResponse<OrderIdDto> = {
      ...response,
      data: { orderId: packageItemsDto.orderId },
    };
    this.amqpConnection.publish<RpcResponse<OrderIdDto>>(
      orderExchange,
      OrderRoutingKey.PackageItemsResponse,
      rpcResponse
    );
  }
}
