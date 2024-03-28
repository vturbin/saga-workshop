import { IsString, Min } from 'class-validator';
import { PaymentDetailsDto } from '../order/payment-details.dto';

export class ProcessPaymentDto extends PaymentDetailsDto {
  @Min(0)
  amount: number;

  @IsString()
  orderId?: string;
}
