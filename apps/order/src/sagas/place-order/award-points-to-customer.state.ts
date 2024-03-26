import { AssignLoyaltyPointsRequestDto } from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { Logger } from '@nestjs/common';

export class AwardPointsToCustomerState extends PlaceOrderSagaState {
  public async execute(): Promise<void> {
    try {
      Logger.debug(`Executing ${AwardPointsToCustomerState.name}`);

      const assignLoyaltyPoints: AssignLoyaltyPointsRequestDto = {
        paidAmount: this.saga.paidAmount,
        userId: this.saga.placeOrderDto.customerId,
      };
      await this.saga.loyaltyClient.awardPointsToCustomer(assignLoyaltyPoints);
    } catch (error) {
      // Do we actually need to revert the whole operation if points were not awarded to the customer?
      Logger.debug(error);
    }
  }
  public compensate(): Promise<void> {
    Logger.debug(
      `No compensation action for ${AwardPointsToCustomerState.name}`
    );
    return;
  }
}
