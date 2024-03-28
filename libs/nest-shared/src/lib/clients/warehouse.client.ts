import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { ItemRequestDto } from '../warehouse/item-request.dto';
import { CheckItemsAvailabilityResponseDto } from '../warehouse/check-items-availability-response.dto';
import { PackageItemsRequestDto } from '../warehouse/package-items-request.dto';
import { ReserveItemsResponseDto } from '../warehouse/reserve-items-response.dto';
import { handleAxiosError } from '../utils/handle-http-error';

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
    items: ItemRequestDto[]
  ): Promise<CheckItemsAvailabilityResponseDto> {
    try {
      const response =
        await this.httpClient.post<CheckItemsAvailabilityResponseDto>(
          'warehouse/check-items-availability',
          items
        );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  public async reserveItems(
    items: ItemRequestDto[]
  ): Promise<ReserveItemsResponseDto> {
    try {
      const response = await this.httpClient.post<ReserveItemsResponseDto>(
        'warehouse/reserve-items',
        items
      );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  public async packageItems(
    packageItemsDto: PackageItemsRequestDto
  ): Promise<void> {
    try {
      const response = await this.httpClient.post<void>(
        'warehouse/package-items',
        packageItemsDto
      );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  public async cancelItemsReservation(items: ItemRequestDto[]): Promise<void> {
    try {
      const response = await this.httpClient.post<void>(
        'warehouse/cancel-items-reservation',
        items
      );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}
