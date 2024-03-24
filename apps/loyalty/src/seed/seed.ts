import mongoose from 'mongoose';
import { DATABASE_CONFIGURATION } from '../app.module';
import {
  CustomerLoyalty,
  CustomerLoyaltyModel,
} from '../models/customer-loyalty.schema';

export async function seedDatabase() {
  await mongoose.connect(DATABASE_CONFIGURATION.mongoConnectionString);

  // Check if the data already exists
  const existingData = await CustomerLoyaltyModel.find(); // Adjust this condition based on your needs
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
    await CustomerLoyaltyModel.insertMany(dataToSeed);

    console.log('Database seeded successfully.');
  } else {
    console.log('Database already seeded.');
  }

  await mongoose.disconnect();
}
