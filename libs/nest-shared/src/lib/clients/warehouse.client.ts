import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { ItemsRequestDto } from '../warehouse/items-request.dto';
import { CheckItemsAvailabilityResponseDto } from '../warehouse/check-items-availability-response.dto';
import { ShippingAddressDto } from '../order/shipping-address.dto';
import { PackageItemsRequestDto } from '../warehouse/package-items-request.dto';

@Injectable()
export class WarehouseClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://warehouse:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async checkItemsAvailability(
    items: ItemsRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    const response =
      await this.httpClient.post<CheckItemsAvailabilityResponseDto>(
        '/check-items-availability',
        items
      );
    return response.data;
  }

  public async reserveItems(items: ItemsRequestDto[]): Promise<number> {
    const response = await this.httpClient.post<number>(
      '/reserve-items',
      items
    );
    return response.data;
  }

  public async packageItems(
    packageItemsDto: PackageItemsRequestDto
  ): Promise<void> {
    const response = await this.httpClient.post<void>(
      '/package-items',
      packageItemsDto
    );
    return response.data;
  }

  public async cancelItemsReservation(items: ItemsRequestDto[]): Promise<void> {
    const response = await this.httpClient.post<void>(
      '/cancel-items-reservation',
      items
    );
    return response.data;
  }
}
