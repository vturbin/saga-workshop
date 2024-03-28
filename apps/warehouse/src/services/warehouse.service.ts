import {
  ItemRequestDto,
  CheckItemsAvailabilityResponseDto,
  ItemAvailabilityDto,
  ShippingAddressDto,
  ReserveItemsResponseDto,
} from '@nest-shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { StockSchema } from '../models/stock.schema';

@Injectable()
export class WarehouseService {
  public constructor(private stockRepository: StockRepository) {}

  public async checkItemsAvailability(
    requestedItems: ItemRequestDto[]
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
    requestedItems: ItemRequestDto[]
  ): Promise<ReserveItemsResponseDto> {
    const itemsMap = new Map<string, number>();
    requestedItems.map((item) => itemsMap.set(item.itemId, item.quantity));
    const totalAmount = await this.stockRepository.reserveItems(itemsMap);
    const reserveItemsResponseDto: ReserveItemsResponseDto = { totalAmount };
    return reserveItemsResponseDto;
  }

  public cancelItemsReservation(cancelItems: ItemRequestDto[]): Promise<void> {
    const itemsMap = new Map<string, number>();
    cancelItems.map((item) => itemsMap.set(item.itemId, item.quantity));

    return this.stockRepository.cancelItemsReservation(itemsMap);
  }

  public async packageItems(
    itemsToPackage: ItemRequestDto[],
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
    const complexMapArray = Array.from(itemsMap.entries());
    const complexJsonString = JSON.stringify(complexMapArray);
    console.log(`following items are being packed: ${complexJsonString}`);

    console.log(
      `Items are being shipped to this address: ${JSON.stringify(
        shippingAddress
      )}`
    );
  }

  private getItemAvailabilityArray(
    requestedItems: ItemRequestDto[],
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
