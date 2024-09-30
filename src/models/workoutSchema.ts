// src/models/userWorkouts.ts
// schema for userWorkouts

import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Workout, Exercise } from '@/types';

type ExerciseDocument = Exercise & Document;

// Define an interface for the Workout schema
type WorkoutDocument = Workout & Document;

const exerciseSchema = new Schema<ExerciseDocument>({
  // this the id that comes from the api
  // mongo will create its own _id
  id: {
    type: String,
    required: [true, 'ID is required'],
    maxlength: [100, 'ID cannot be greater than 100 characters'],
  },
  bodyPart: {
    type: String,
    required: [true, 'Body Part is required'],
    maxlength: [100, 'Body Part cannot be greater than 100 characters'],
  },
  gifUrl: {
    type: String,
    required: [false, 'Gif URL is required'],
  },
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    maxlength: [100, 'Equipment cannot be greater than 100 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [100, 'Name cannot be greater than 100 characters'],
  },
  target: {
    type: String,
    required: [true, 'Target is required'],
    maxlength: [100, 'Target cannot be greater than 100 characters'],
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
      type: String
    }
  ],
  comments: [
    {
      text: String,
      postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  saves: [
    {
      type: String
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
