import { Module } from '@nestjs/common';

import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NestSharedModule } from '@nest-shared';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceOrderSaga } from './sagas/place-order/place-order.saga';
import { CheckItemsAvailabilityState } from './sagas/place-order/check-items-availability.state';
import { ReserveItemsState } from './sagas/place-order/reserve-items.state';
import { ProcessPaymentState } from './sagas/place-order/process-payment.state';
import { AwardPointsToCustomerState } from './sagas/place-order/award-points-to-customer.state';
import { PackageItemsState } from './sagas/place-order/package-items.state';

const LOCAL_CONNECTION_STRING =
  'mongodb://root:examplepassword@localhost:27017/workshop?authSource=admin?replicaSet=rs0';
export const DATABASE_CONFIGURATION = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING_DOCKER
    ? process.env.MONGO_CONNECTION_STRING_DOCKER
    : LOCAL_CONNECTION_STRING,
};

@Module({
  imports: [
    MongooseModule.forRoot(
      DATABASE_CONFIGURATION.mongoConnectionString as string
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_CONNECTION_STRING_DOCKER: Joi.string().default(
          DATABASE_CONFIGURATION.mongoConnectionString
        ),
        RABBITMQ_USER: Joi.string().default('myuser'),
        RABBITMQ_PASSWORD: Joi.string().default('mypassword'),
        RABBITMQ_PORT: Joi.number().default(5672),
      }),
    }),
    NestSharedModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    PlaceOrderSaga,
    CheckItemsAvailabilityState,
    ReserveItemsState,
    ProcessPaymentState,
    ReserveItemsState,
    AwardPointsToCustomerState,
    PackageItemsState,
  ],
})
export class AppModule {}
