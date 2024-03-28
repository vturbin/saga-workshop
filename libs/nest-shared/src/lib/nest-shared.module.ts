import { Module } from '@nestjs/common';
import { MongooseSession } from './db/mongoose-session';
import { UnitOfWork } from './db/unit-of-work';
import { RabbitMQModule as SharedRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { orderExchange } from './constants/rmq.constants';

@Module({
  controllers: [],
  imports: [
    SharedRabbitMQModule.forRoot(SharedRabbitMQModule, {
      exchanges: [{ name: orderExchange, type: 'topic' }],
      uri: `amqp://${process.env['RABBITMQ_USER']}:${process.env['RABBITMQ_PASSWORD']}@rabbitmq:${process.env['RABBITMQ_PORT']}`,
      prefetchCount: 1,
    }),
  ],
  providers: [MongooseSession, UnitOfWork],
  exports: [MongooseSession, UnitOfWork, SharedRabbitMQModule],
})
export class NestSharedModule {}
