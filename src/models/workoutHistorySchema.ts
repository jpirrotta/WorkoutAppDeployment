// src/models/workoutHistorySchema.ts

import { Schema } from 'mongoose';
import { WorkoutHistory, ExerciseHistory } from '@/types';

export const exerciseHistorySchema = new Schema<ExerciseHistory>({
  name: { type: String, required: true },
  primaryMuscle: { type: String, required: true },
  sets: [
    {
      sets: { type: Number, required: true, min: 1 },
      reps: { type: Number, required: true, min: 1 },
      weight: { type: Number, required: true, min: 0 },
    },
  ],
});

export const workoutHistorySchema = new Schema<WorkoutHistory>({
  name: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    // Store date only, truncate time
    set: (date: Date) => new Date(date.setHours(0, 0, 0, 0)),
  },
  duration: { type: Number, required: true },
  completedExercises: { type: Number, required: true },
  totalExercises: { type: Number, required: true },
  exercises: [exerciseHistorySchema],
});
