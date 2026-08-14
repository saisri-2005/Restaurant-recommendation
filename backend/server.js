const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Restaurant = require('./models/Restaurant');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Recommendation API is running'
  });
});

// Get restaurants with optional filters
app.get('/api/restaurants', async (req, res) => {
  try {
    const {
      city,
      cuisine,
      minRating,
      search
    } = req.query;

    const filter = {};

    // Filter by city
    if (city) {
      filter.location = {
        $regex: city,
        $options: 'i'
      };
    }

    // Filter by cuisine
    if (cuisine) {
      filter.cuisine = {
        $regex: cuisine,
        $options: 'i'
      };
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = {
        $gte: Number(minRating)
      };
    }

    // Search restaurant name
    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i'
      };
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1 })
      .limit(100);

    res.json(restaurants);

  } catch (error) {
    console.error('Error fetching restaurants:', error);

    res.status(500).json({
      message: 'Failed to fetch restaurants'
    });
  }
});

// Get a single restaurant
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found'
      });
    }

    res.json(restaurant);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch restaurant'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});