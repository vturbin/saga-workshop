import {
  LoyaltyClient,
  PaymentClient,
  PlaceOrderDTO,
  WarehouseClient,
} from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { CheckItemsAvailabilityState } from './check-items-availability.state';
import { ReserveItemsState } from './reserve-items.state';
import { ProcessPaymentState } from './process-payment.state';
import { PackageItemsState } from './package-items.state';
import { AwardPointsToCustomerState } from './award-points-to-customer.state';

export class PlaceOrderSaga {
  public paidAmount = 0;
  public paymentId: string;

  private steps: PlaceOrderSagaState[] = [];

  /* To keep track of the already successful steps, we will need this information to undo them in case of an error. */
  private successfulSteps: PlaceOrderSagaState[] = [];

  public constructor(
    public placeOrderDto: PlaceOrderDTO,
    public readonly loyaltyClient: LoyaltyClient,
    public readonly warehouseClient: WarehouseClient,
    public readonly paymentClient: PaymentClient
  ) {
    this.steps = [
      new CheckItemsAvailabilityState(),
      new ReserveItemsState(),
      new ProcessPaymentState(),
      new PackageItemsState(),
      new AwardPointsToCustomerState(),
    ];
    for (const step of this.steps) {
      step.setContext(this);
    }
  }

  public async init(): Promise<void> {
    /* We loop through each step */
    for (const step of this.steps) {
      try {
        /* We Invoke each step */
        await step.execute();
        /* and keep track of each succeful step */
        this.successfulSteps.unshift(step);
      } catch (error) {
        /* If an error has occurred, undo the previous successful steps. */
        this.successfulSteps.forEach(async (successfulStep) => {
          await successfulStep.compensate();
        });
        throw error;
      }
    }
  }
}
