import { IsString, ValidateNested } from 'class-validator';
import { ItemRequestDto } from './item-request.dto';
import { Type } from 'class-transformer';

export class OrderItemsRequestDto {
  @ValidateNested()
  @Type(() => ItemRequestDto)
  items: ItemRequestDto[];

  @IsString()
  orderId: string;
}
