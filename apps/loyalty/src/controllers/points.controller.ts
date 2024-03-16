import { Body, Controller, Post } from '@nestjs/common';

import { PointsService } from '../services/points.service';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
} from '@nest-shared';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  public async awardPointsToCustomer(
    @Body() assignLoyaltyPointsDto: AssignLoyaltyPointsRequestDto
  ): Promise<AssignLoyaltyPointsResponseDto> {
    return this.pointsService.awardPointsToCustomer(
      assignLoyaltyPointsDto.userId,
      assignLoyaltyPointsDto.paidAmount
    );
  }
}
