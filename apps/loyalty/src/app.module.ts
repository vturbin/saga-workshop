import { Module } from '@nestjs/common';

import { PointsController } from './controllers/points.controller';
import { PointsService } from './services/points.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_CONNECTION_STRING_DOCKER: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [PointsController],
  providers: [PointsService],
})
export class AppModule {}
