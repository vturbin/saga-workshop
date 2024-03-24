import {
  ItemsRequestDto,
  CheckItemsAvailabilityResponseDto,
  ItemAvailabilityDto,
  ShippingAddressDto,
} from '@nest-shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { StockSchema } from '../models/stock.schema';

@Injectable()
export class WarehouseService {
  public constructor(private stockRepository: StockRepository) {}

  public async checkItemsAvailability(
    requestedItems: ItemsRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    const itemIds = requestedItems.map((item) => item.itemId);
    const itemsInStock = await this.stockRepository.getItemsInStock(itemIds);
    const itemsAvailability = this.getItemAvailabilityArray(
      requestedItems,
      itemsInStock
    );
    const allItemsAvailable = itemsAvailability.every((item) => item.available);
    const response: CheckItemsAvailabilityResponseDto = {
      allItemsAvailable,
      availability: itemsAvailability,
    };
    return response;
  }

  public async reserveItems(
    requestedItems: ItemsRequestDto[]
  ): Promise<number> {
    const itemsMap = new Map<string, number>();
    requestedItems.map((item) => itemsMap.set(item.itemId, item.quantity));

    return this.stockRepository.reserveItems(itemsMap);
  }

  public cancelItemsReservation(cancelItems: ItemsRequestDto[]): Promise<void> {
    const itemsMap = new Map<string, number>();
    cancelItems.map((item) => itemsMap.set(item.itemId, item.quantity));

    return this.stockRepository.cancelItemsReservation(itemsMap);
  }

  public async packageItems(
    itemsToPackage: ItemsRequestDto[],
    shippingAddress: ShippingAddressDto
  ): Promise<void> {
    const itemsMap = new Map<string, number>();
    itemsToPackage.map((item) => itemsMap.set(item.itemId, item.quantity));

    const failOrNotToFail = Math.random();

    if (failOrNotToFail < 0.5) {
      throw new BadRequestException('Could not package items');
    }

    await this.stockRepository.updateItemsInStock(itemsMap);
    this.doSomeFancyPackagingOperations(itemsMap, shippingAddress);

    return;
  }

  private doSomeFancyPackagingOperations(
    itemsMap: Map<string, number>,
    shippingAddress: ShippingAddressDto
  ) {
    console.log(
      `following items are being packed: ${JSON.stringify(itemsMap)}`
    );
    console.log(
      `Items are being shipped to this address: ${JSON.stringify(
        shippingAddress
      )}`
    );
  }

  private getItemAvailabilityArray(
    requestedItems: ItemsRequestDto[],
    itemsInStock: StockSchema[]
  ): ItemAvailabilityDto[] {
    const itemAvailabilityArrayDto: ItemAvailabilityDto[] = [];
    for (const requestedItem of requestedItems) {
      const itemInStock = itemsInStock.find(
        (item) => item.itemId === requestedItem.itemId
      );
      let itemAvailabilityDto: ItemAvailabilityDto;
      if (!itemInStock) {
        itemAvailabilityDto = {
          itemId: requestedItem.itemId,
          available: false,
          reason: 'Requested item does not exist',
        };
      } else {
        const freeInStock =
          itemInStock.currentStock - itemInStock.reservedAmount;
        const available = freeInStock >= requestedItem.quantity;
        itemAvailabilityDto = {
          itemId: requestedItem.itemId,
          available,
        };
        if (!available) {
          itemAvailabilityDto.reason = `Requested amount is not available. Only ${itemInStock.currentStock} items in stock!`;
        }
      }

      itemAvailabilityArrayDto.push(itemAvailabilityDto);
    }
    return itemAvailabilityArrayDto;
  }
}
