import {
  CheckItemsAvailabilityRequestDto,
  CheckItemsAvailabilityResponseDto,
  ItemAvailabilityDto,
} from '@nest-shared';
import { Injectable } from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { StockSchema } from '../models/stock.schema';

@Injectable()
export class WarehouseService {
  public constructor(private stockRepository: StockRepository) {}

  public async checkItemsAvailability(
    requestedItems: CheckItemsAvailabilityRequestDto[]
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

  private getItemAvailabilityArray(
    requestedItems: CheckItemsAvailabilityRequestDto[],
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
        const available = itemInStock.currentStock >= requestedItem.quantity;
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
