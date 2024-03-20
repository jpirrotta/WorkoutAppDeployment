// src/models/user.js
import workoutSchema from './workoutSchema';
import mongoose, { Schema } from 'mongoose';
const historySchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    value: Number,
  },
  { _id: false }
);

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
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
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    weight: {
      type: Number,
      min: 1,
      max: 600,
    },
    height: {
      type: Number,
      min: 1,
      max: 300,
    },
    bodyFat: {
      type: Number,
      min: 1,
      max: 50,
    },
  },
  weightHistory: [historySchema],
  bodyFatHistory: [historySchema],
  workouts: [workoutSchema],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
