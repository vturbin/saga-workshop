import { Injectable } from '@nestjs/common';
import { PointsService } from '../services/points.service';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  OrderRoutingKey,
  RpcResponse,
  handleRPCServiceCall,
  orderExchange,
  orderQueue,
} from '@nest-shared';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PointsRMQController {
  constructor(private readonly pointsService: PointsService) {}

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.AwardPoints,
    queue: orderQueue,
  })
  public async awardPointsToCustomer(
    assignLoyaltyPointsDto: AssignLoyaltyPointsRequestDto
  ): Promise<RpcResponse<AssignLoyaltyPointsResponseDto>> {
    return handleRPCServiceCall(
      this.pointsService.awardPointsToCustomer(
        assignLoyaltyPointsDto.userId,
        assignLoyaltyPointsDto.paidAmount
      )
    );
  }
}
