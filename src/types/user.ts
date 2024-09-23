import { Workout } from '@/types';

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

export type WorkoutHistory = {
  date: Date;
  value: number;
};

export type User = {
  userId: string;
  name: string;
  profile?: Profile;
  bmi?: BMI;
  weightHistory?: WorkoutHistory[];
  bodyFatHistory?: WorkoutHistory[];
  workouts: Workout[];
  savedWorkouts: string[];
};
