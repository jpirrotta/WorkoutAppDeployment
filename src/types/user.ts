import { Workout, WorkoutHistory } from '@/types';
import { Document } from 'mongoose';

export type BMI = {
  score: number;
  category: string;
};

export type Profile = {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  bodyFat?: number;
};

export type MetricHistory = {
  date: Date;
  value: number;
};

export type User = {
  userId: string;
  name: string;
  profile?: Profile;
  bmi?: BMI;
  weightHistory?: MetricHistory[];
  bodyFatHistory?: MetricHistory[];
  workoutHistory?: WorkoutHistory[];
  workouts?: Workout[] & Document;
  savedWorkouts?: { workoutId: string }[];
  favExercises?: string[];
};
