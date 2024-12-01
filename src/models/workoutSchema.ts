// src/models/userWorkouts.ts
// schema for userWorkouts

import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Workout, Exercise } from '@/types';

type ExerciseDocument = Exercise & Document;

// Define an interface for the Workout schema
type WorkoutDocument = Workout & Document;

const exerciseSchema = new Schema<ExerciseDocument>({
  // UPDATE: we will only store respected exercise id that is related to API we are using
  // this the id that comes from the api
  // mongo will create its own _id as well
  id: {
    type: String,
    required: [true, 'ID is required'],
    maxlength: [100, 'ID cannot be greater than 100 characters'],
  },
  sets: [
    {
      sets: {
        type: Number,
        required: [true, 'Sets are required'],
        min: [1, 'Sets must be at least 1'],
      },
      reps: {
        type: Number,
        required: [true, 'Reps are required'],
        min: [1, 'Reps must be at least 1'],
      },
      weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight must be at least 0'],
      },
    },
  ],
});

const workoutSchema = new Schema<WorkoutDocument>({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    maxlength: [100, 'Workout name cannot be greater than 100 characters'],
  },
  exercises: [exerciseSchema],
  public: {
    type: Boolean,
    default: false,
  },
  postDate: {
    type: Date,
  },
  likes: [
    {
      userId: String, 
      date: Date,
    },
  ],
  comments: [
    {
      text: String,
      userId: String,
    },
  ],
  saves: [
    {
      userId: String, 
      date: Date,
    },
  ],
});

export const WorkoutModel: Model<WorkoutDocument> =
  mongoose.models.Workout ||
  mongoose.model<WorkoutDocument>('Workout', workoutSchema);

export const ExerciseModel: Model<ExerciseDocument> =
  mongoose.models.Exercise ||
  mongoose.model<ExerciseDocument>('Exercise', exerciseSchema);

export default workoutSchema;
