import { CustomerLoyalty } from '../models/customer-loyalty.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(CustomerLoyalty.name)
    private collection: Model<CustomerLoyalty>
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    // Check if the data already exists
    const existingData = await this.collection.find(); // Adjust this condition based on your needs
    if (!existingData.length) {
      console.log('Seeding database...');

      // List of data to seed
      const dataToSeed: CustomerLoyalty[] = [
        {
          userId: '1',
          points: 0,
        },
        {
          userId: '2',
          points: 0,
        },
        {
          userId: '3',
          points: 0,
        },
        {
          userId: '4',
          points: 0,
        },
        {
          userId: '5',
          points: 0,
        },
      ];

      // Insert data into your collection
      await this.collection.insertMany(dataToSeed);

      console.log('Database seeded successfully.');
    } else {
      console.log('Database already seeded.');
    }
  }
}
