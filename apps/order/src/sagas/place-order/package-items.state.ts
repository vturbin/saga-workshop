import { PackageItemsRequestDto } from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { Logger } from '@nestjs/common';

export class PackageItemsState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    Logger.debug(`Executing ${PackageItemsState.name}`);

    const packageItemsDto: PackageItemsRequestDto = {
      items: this.saga.placeOrderDto.items,
      shippingAddress: this.saga.placeOrderDto.shippingAddress,
    };
    try {
      await this.saga.warehouseClient.packageItems(packageItemsDto);
    } catch (error) {
      Logger.debug(`${PackageItemsState.name} failed`);
      throw error;
    }
  }
  public compensate(): Promise<void> {
    Logger.debug(`No compensation action for ${PackageItemsState.name}`);
    return;
  }
}
