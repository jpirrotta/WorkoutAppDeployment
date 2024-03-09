// src/models/userWorkouts.js
// schema for userWorkouts

import mongoose, { Schema } from 'mongoose';

const exerciseSchema = new Schema({
  bodyPart: {
    type: String,
    required: [false, 'Body Part is required'],
    max: [100, 'Body Part cannot be greater than 100 characters'],
  },
  equipment: {
    type: String,
    required: [false, 'Equipment is required'],
    max: [100, 'Equipment cannot be greater than 100 characters'],
  },
  id: {
    type: String,
    required: [false, 'ID is required'],
    max: [100, 'ID cannot be greater than 100 characters'],
  },
  name: {
    type: String,
    required: [false, 'Name is required'],
    max: [100, 'Name cannot be greater than 100 characters'],
  },
  target: {
    type: String,
    required: [false, 'Target is required'],
    max: [100, 'Target cannot be greater than 100 characters'],
  },
  secondaryMuscles: {
    type: [String],
    required: [false, 'Secondary Muscles are required'],
  },
  instructions: {
    type: [String],
    required: [false, 'Instructions are required'],
  },
});

const workoutSchema = new Schema({
  exercises: [exerciseSchema],
});


export default workoutSchema;
