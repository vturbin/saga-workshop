import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  CheckItemsAvailabilityResponseDto,
  ItemsRequestDto,
  OrderRoutingKey,
  PackageItemsRequestDto,
  ReserveItemsResponseDto,
  RpcResponse,
  handleRPCServiceCall,
  orderExchange,
  orderQueue,
} from '@nest-shared';
import { WarehouseService } from '../services/warehouse.service';

@Injectable()
export class WarehouseRMQController {
  constructor(private warehouseService: WarehouseService) {}

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CheckItemsAvailability,
    queue: orderQueue,
  })
  public async checkItemsAvailability(
    items: ItemsRequestDto[]
  ): Promise<RpcResponse<CheckItemsAvailabilityResponseDto>> {
    return handleRPCServiceCall(
      this.warehouseService.checkItemsAvailability(items)
    );
  }

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ReserveItems,
    queue: orderQueue,
  })
  public async reserveItems(
    items: ItemsRequestDto[]
  ): Promise<RpcResponse<ReserveItemsResponseDto>> {
    return handleRPCServiceCall(this.warehouseService.reserveItems(items));
  }

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.CancelItemsReservation,
    queue: orderQueue,
  })
  public async cancelItemsReservation(
    items: ItemsRequestDto[]
  ): Promise<RpcResponse<void>> {
    return handleRPCServiceCall(
      this.warehouseService.cancelItemsReservation(items)
    );
  }

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.PackageItems,
    queue: orderQueue,
  })
  public async packageItems(
    packageItemsDto: PackageItemsRequestDto
  ): Promise<RpcResponse<void>> {
    return handleRPCServiceCall(
      this.warehouseService.packageItems(
        packageItemsDto.items,
        packageItemsDto.shippingAddress
      )
    );
  }
}
