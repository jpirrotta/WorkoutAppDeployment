// src/models/user.js
const mongoose = require('mongoose');
const workoutSchema = require('./workoutSchema');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profile: {
    age: {
      type: Number,
      min: 8,
      max: 99,
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    weight: {
      type: Number,
      min: 20,
      max: 200,
    },
    height: {
      type: Number,
      min: 60,
      max: 250,
    },
    bodyFat: {
      type: Number,
      min: 3,
      max: 50,
    },
  },
  workouts: [workoutSchema],
});

module.exports = mongoose.model('User', userSchema);
