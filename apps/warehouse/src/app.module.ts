import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { WarehouseController } from './controllers/warehouse.controller';
import { WarehouseService } from './services/warehouse.service';
import { StockSchema, stockSchema } from './models/stock.schema';
import { StockRepository } from './repositories/stock.repository';
import { MongooseSession, NestSharedModule, UnitOfWork } from '@nest-shared';
import { SeedService } from './seed/seed';
import { WarehouseRMQController } from './controllers/warehouse-rmq.controller';

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
      { name: StockSchema.name, schema: stockSchema },
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
    NestSharedModule,
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    StockRepository,
    UnitOfWork,
    MongooseSession,
    SeedService,
    WarehouseRMQController,
  ],
})
export class AppModule {}
