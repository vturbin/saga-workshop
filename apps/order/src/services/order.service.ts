import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
