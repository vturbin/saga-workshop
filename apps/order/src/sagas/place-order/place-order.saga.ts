import { OrderDto, PlaceOrderDTO } from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { CheckItemsAvailabilityState } from './check-items-availability.state';
import { Injectable } from '@nestjs/common';
import { ReserveItemsState } from './reserve-items.state';
import { ProcessPaymentState } from './process-payment.state';
import { PackageItemsState } from './package-items.state';
import { AwardPointsToCustomerState } from './award-points-to-customer.state';

export interface SagaTempData {
  placeOrderDto: PlaceOrderDTO;
  paymentId?: string;
  paidAmount?: number;
}

@Injectable()
export class PlaceOrderSaga {
  private steps: PlaceOrderSagaState[] = [];

  public tempData = new Map<string, SagaTempData>();

  public constructor(
    private readonly step1: CheckItemsAvailabilityState,
    private readonly step2: ReserveItemsState,
    private readonly step3: ProcessPaymentState,
    private readonly step4: PackageItemsState,
    private readonly step5: AwardPointsToCustomerState
  ) {
    this.steps = [this.step1, this.step2, this.step3, this.step4, this.step5];
    for (const step of this.steps) {
      step.setContext(this);
    }
  }

  public async init(orderDto: OrderDto): Promise<void> {
    this.tempData.set(orderDto.orderId, { placeOrderDto: orderDto });
    await this.step1.execute(orderDto.orderId);
  }

  public compensatePreviousStep(
    currentStepName: string,
    orderId: string
  ): void {
    const index = this.steps.findIndex((step) => step.name === currentStepName);
    if (index > 0) {
      this.steps[index - 1].compensate(orderId);
      return;
    }

    this.tempData.delete(orderId);
  }

  public executeNextStep(currentStepName: string, orderId: string): void {
    const index = this.steps.findIndex((step) => step.name === currentStepName);
    if (index < this.steps.length - 1) {
      this.steps[index + 1].execute(orderId);
      return;
    }
    this.tempData.delete(orderId);
  }
}
