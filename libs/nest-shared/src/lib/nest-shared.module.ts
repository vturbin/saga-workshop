import { Module } from '@nestjs/common';
import { LoyaltyClient } from './clients/loyalty.client';

@Module({
  controllers: [],
  providers: [],
  exports: [LoyaltyClient],
})
export class NestSharedModule {}
