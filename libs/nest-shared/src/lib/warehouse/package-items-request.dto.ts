import { Type } from 'class-transformer';
import { ShippingAddressDto } from '../order/shipping-address.dto';
import { ItemRequestDto } from './item-request.dto';
import { IsString, ValidateNested } from 'class-validator';

export class PackageItemsRequestDto {
  @IsString()
  orderId?: string;

  @Type(() => ItemRequestDto)
  @ValidateNested()
  items: ItemRequestDto[];

  @Type(() => ShippingAddressDto)
  @ValidateNested()
  shippingAddress: ShippingAddressDto;
}
