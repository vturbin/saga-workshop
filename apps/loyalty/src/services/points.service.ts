import { Injectable } from '@nestjs/common';
import { CustomerLoyaltyRepository } from '../repositories/customer-loyalty.repository';
import { AssignLoyaltyPointsResponseDto } from '@shared';
@Injectable()
export class PointsService {
  constructor(private customerLoyaltyRepository: CustomerLoyaltyRepository) {}

  public async awardPointsToCustomer(
    userId: string,
    paidAmount: number
  ): Promise<AssignLoyaltyPointsResponseDto> {
    const pointsEarned = Math.round(paidAmount * 0.5);
    const updatedPointsDocument =
      await this.customerLoyaltyRepository.addLoyaltyPoints(
        userId,
        pointsEarned
      );

    return {
      userId,
      points: updatedPointsDocument.points,
    };
  }
}
