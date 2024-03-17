import { Module } from '@nestjs/common';
import { LoyaltyClient } from './clients/loyalty.client';
import { MongooseSession } from './db/mongoose-session';
import { UnitOfWork } from './db/unit-of-work';

@Module({
  controllers: [],
  providers: [MongooseSession, UnitOfWork],
  exports: [LoyaltyClient, MongooseSession, UnitOfWork],
})
export class NestSharedModule {}
