// src/models/userWorkouts.js
// schema for userWorkouts

import { Schema } from 'mongoose';

const exerciseSchema = new Schema({
  id: {
    type: String,
    required: [true, 'ID is required'],
    max: [100, 'ID cannot be greater than 100 characters'],
  },
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

const workoutSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    max: [100, 'Workout name cannot be greater than 100 characters'],
  },
  exercises: [exerciseSchema],
});

export default workoutSchema;
