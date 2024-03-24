import { Type } from 'class-transformer';
import { ShippingAddressDto } from '../order/shipping-address.dto';
import { ItemsRequestDto } from './items-request.dto';
import { ValidateNested } from 'class-validator';

export class PackageItemsRequestDto {
  @Type(() => ItemsRequestDto)
  @ValidateNested()
  items: ItemsRequestDto[];

  @Type(() => ShippingAddressDto)
  @ValidateNested()
  shippingAddress: ShippingAddressDto;
}
