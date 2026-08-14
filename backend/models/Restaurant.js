const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  address: {
    type: String
  },

  cuisine: {
    type: [String],
    default: []
  },

  rating: {
    type: Number,
    default: 0
  },

  votes: {
    type: Number,
    default: 0
  },

  averageCostForTwo: {
    type: Number,
    default: 0
  },

  priceRange: {
    type: Number,
    default: 0
  },

  hasOnlineDelivery: {
    type: Boolean,
    default: false
  },

  hasTableBooking: {
    type: Boolean,
    default: false
  },

  lat: {
    type: Number,
    required: true
  },

  lng: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);