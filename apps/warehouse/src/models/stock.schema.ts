import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'stock' })
export class StockSchema {
  @Prop({ required: true, unique: true })
  public itemId: string;

  @Prop({ required: true })
  public currentStock: number;
}

export const stockSchema = SchemaFactory.createForClass(StockSchema);
