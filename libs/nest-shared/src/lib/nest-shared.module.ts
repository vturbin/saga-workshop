import { Module } from '@nestjs/common';
import { LoyaltyClient } from './clients/loyalty.client';
import { MongooseSession } from './db/mongoose-session';
import { UnitOfWork } from './db/unit-of-work';
import { PaymentClient } from './clients/payment.client';
import { WarehouseClient } from './clients/warehouse.client';

@Module({
  controllers: [],
  providers: [MongooseSession, UnitOfWork],
  exports: [
    LoyaltyClient,
    MongooseSession,
    UnitOfWork,
    PaymentClient,
    WarehouseClient,
  ],
})
export class NestSharedModule {}
