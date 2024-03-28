import { IsString } from 'class-validator';
import { PlaceOrderDTO } from './place-order.dto';

export class OrderDto extends PlaceOrderDTO {
  @IsString()
  orderId: string;
}
