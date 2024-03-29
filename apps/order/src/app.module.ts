import { Module } from '@nestjs/common';

import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoyaltyClient, PaymentClient, WarehouseClient } from '@nest-shared';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [OrderController],
  providers: [OrderService, LoyaltyClient, WarehouseClient, PaymentClient],
})
export class AppModule {}
