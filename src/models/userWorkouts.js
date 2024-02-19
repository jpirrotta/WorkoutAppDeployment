// src/models/userWorkouts.js
// schema for userWorkouts

import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  bodyPart: {
    type: String,
    required: [true, 'Body Part is required'],
    max: [100, 'Body Part cannot be greater than 100 characters'],
  },
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    max: [100, 'Equipment cannot be greater than 100 characters'],
  },
  id: {
    type: String,
    required: [true, 'ID is required'],
    max: [100, 'ID cannot be greater than 100 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    max: [100, 'Name cannot be greater than 100 characters'],
  },
  target: {
    type: String,
    required: [true, 'Target is required'],
    max: [100, 'Target cannot be greater than 100 characters'],
  },
  secondaryMuscles: {
    type: [String],
    required: [true, 'Secondary Muscles are required'],
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required'],
  },
});

exerciseSchema.pre('save', function(next) {
  if (this.EquipmentType === 'body weight') {
    this.weight = 0;
  }
  next();
});

const workoutSchema = new mongoose.Schema({
  exercises: [exerciseSchema],
});

const userWorkoutsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  workouts: [workoutSchema],
});

export default mongoose.models.UserWorkouts || mongoose.model('UserWorkouts', userWorkoutsSchema);