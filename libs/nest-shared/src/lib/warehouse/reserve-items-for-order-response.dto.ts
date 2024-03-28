import { IsString } from 'class-validator';
import { ReserveItemsResponseDto } from './reserve-items-response.dto';

export class ReserveItemsForOrderResponseDto extends ReserveItemsResponseDto {
  @IsString()
  orderId: string;
}
