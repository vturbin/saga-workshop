import { Body, Controller, Post } from '@nestjs/common';

import {
  ItemRequestDto,
  CheckItemsAvailabilityResponseDto,
  PackageItemsRequestDto,
  ReserveItemsResponseDto,
} from '@nest-shared';
import { WarehouseService } from '../services/warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post('check-items-availability')
  public async checkItemsAvailability(
    @Body() items: ItemRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    return this.warehouseService.checkItemsAvailability(items);
  }

  @Post('reserve-items')
  public async reserveItems(
    @Body() items: ItemRequestDto[]
  ): Promise<ReserveItemsResponseDto> {
    return this.warehouseService.reserveItems(items);
  }

  @Post('cancel-items-reservation')
  public async cancelItemsReservation(
    @Body() items: ItemRequestDto[]
  ): Promise<void> {
    return this.warehouseService.cancelItemsReservation(items);
  }

  @Post('package-items')
  public async packageItems(
    @Body() packageItemsDto: PackageItemsRequestDto
  ): Promise<void> {
    return this.warehouseService.packageItems(
      packageItemsDto.items,
      packageItemsDto.shippingAddress
    );
  }
}
