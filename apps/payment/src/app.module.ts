import { Module } from '@nestjs/common';

import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentHistorySchema,
  paymentHistorySchema,
} from './models/payment-history.schema';
import { PaymentHistoryRepository } from './repositories/payment-history.repository';
import { MongooseSession, UnitOfWork } from '@nest-shared';

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
    MongooseModule.forFeature([
      { name: PaymentHistorySchema.name, schema: paymentHistorySchema },
    ]),
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
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentHistoryRepository,
    UnitOfWork,
    MongooseSession,
  ],
})
export class AppModule {}
