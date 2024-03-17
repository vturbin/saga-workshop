import { Body, Controller, Post } from '@nestjs/common';

import {
  ItemsRequestDto,
  CheckItemsAvailabilityResponseDto,
} from '@nest-shared';
import { WarehouseService } from '../services/warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post('check-items-availability')
  public async checkItemsAvailability(
    @Body() items: ItemsRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    return this.warehouseService.checkItemsAvailability(items);
  }

  @Post('reserve-items')
  public async reserveItems(@Body() items: ItemsRequestDto[]): Promise<void> {
    return this.warehouseService.reserveItems(items);
  }

  @Post('reserve-items')
  public async cancelItemsReservation(
    @Body() items: ItemsRequestDto[]
  ): Promise<void> {
    return this.warehouseService.cancelItemsReservation(items);
  }
}
