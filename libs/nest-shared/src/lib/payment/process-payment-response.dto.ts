import { IsString } from 'class-validator';
import { PaymentIdDto } from './payment-id.dto';

export class ProcessPaymentResponseDto extends PaymentIdDto {
  @IsString()
  orderId: string;
}
