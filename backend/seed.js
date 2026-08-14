const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const Restaurant = require('./models/Restaurant');

const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Remove old restaurant data
    await Restaurant.deleteMany({});
    console.log('Old restaurant data removed');

    const restaurants = [];

    fs.createReadStream('./data/zomato.csv')
      .pipe(csv({ encoding: 'latin1' }))
      .on('data', (row) => {
        const lat = parseFloat(row['Latitude']);
        const lng = parseFloat(row['Longitude']);

        // Skip records without valid coordinates
        if (isNaN(lat) || isNaN(lng)) {
          return;
        }

        const cuisines = row['Cuisines']
          ? row['Cuisines']
              .split(',')
              .map(cuisine => cuisine.trim())
              .filter(Boolean)
          : [];

        restaurants.push({
          name: row['Restaurant Name']?.trim() || 'Unknown Restaurant',

          location:
            row['City']?.trim() ||
            row['Locality']?.trim() ||
            'Unknown',

          address: row['Address']?.trim() || '',

          cuisine: cuisines,

          rating: parseFloat(row['Aggregate rating']) || 0,

          votes: parseInt(row['Votes']) || 0,

          averageCostForTwo:
            parseInt(row['Average Cost for two']) || 0,

          priceRange:
            parseInt(row['Price range']) || 0,

          hasOnlineDelivery:
            row['Has Online delivery']?.toLowerCase() === 'yes',

          hasTableBooking:
            row['Has Table booking']?.toLowerCase() === 'yes',

          lat: lat,

          lng: lng,

          description:
            `${cuisines.join(', ')} restaurant in ${row['City'] || 'the selected city'}`
        });
      })
      .on('end', async () => {
        try {
          await Restaurant.insertMany(restaurants);

          console.log(
            `${restaurants.length} restaurants inserted successfully`
          );

          await mongoose.connection.close();
          console.log('MongoDB connection closed');
        } catch (error) {
          console.error('Error inserting restaurants:', error);
          process.exit(1);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        process.exit(1);
      });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

seedDatabase();