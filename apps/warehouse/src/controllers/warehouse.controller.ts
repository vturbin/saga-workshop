import { Body, Controller, Post } from '@nestjs/common';

import {
  CheckItemsAvailabilityRequestDto,
  CheckItemsAvailabilityResponseDto,
} from '@nest-shared';
import { WarehouseService } from '../services/warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post('check-items-availability')
  public async checkItemsAvailability(
    @Body() items: CheckItemsAvailabilityRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    return this.warehouseService.checkItemsAvailability(items);
  }
}
