// src/models/user.ts
import workoutSchema from './workoutSchema';
import mongoose, { Schema, Document, Model } from 'mongoose';
import type { User, WorkoutHistory } from '@/types';

export type UserDocument = User & Document;

const historySchema = new Schema<WorkoutHistory>(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>({
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
  workouts: { type: [workoutSchema], default: [] },
  savedWorkouts: [ String ],
});

const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
