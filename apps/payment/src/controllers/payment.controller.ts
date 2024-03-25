import {
  PaymentIdDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from '@nest-shared';
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process-payment')
  public async processPayment(
    @Body() paymentDetails: ProcessPaymentDto
  ): Promise<PaymentIdDto> {
    return this.paymentService.processPayment(paymentDetails);
  }

  @Post('refund-payment')
  public async refundPayment(
    @Body() refundPaymentDto: RefundPaymentDto
  ): Promise<void> {
    return this.paymentService.refundPayment(refundPaymentDto.paymentId);
  }
}
