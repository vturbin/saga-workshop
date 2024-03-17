import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { ItemsRequestDto } from '../warehouse/items-request.dto';
import { CheckItemsAvailabilityResponseDto } from '../warehouse/check-items-availability-response.dto';

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
}
