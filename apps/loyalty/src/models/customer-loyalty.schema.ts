import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'user' })
export class CustomerLoyalty {
  @Prop({ required: true, unique: true })
  public userId: string;

  @Prop({ required: true })
  public points: number;
}

export const customerLoyaltySchema =
  SchemaFactory.createForClass(CustomerLoyalty);
