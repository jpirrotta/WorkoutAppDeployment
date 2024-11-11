import mongoose, { Document } from 'mongoose';
import z from 'zod';

export const playerFormSchema = z.object({
  sets: z.array(
    z.object({
      reps: z.number().min(1),
      weight: z.number().min(0),
    })
  ),
});

export const exerciseSetsSchema = z.object({
  sets: z.array(
    z.object({
      sets: z.number().min(1),
      reps: z.number().min(1),
      weight: z.number().min(0),
    })
  ),
});

export type FlatSets = z.infer<typeof playerFormSchema>['sets'];

export type Sets = z.infer<typeof exerciseSetsSchema>['sets'];

export type Exercise = {
  _id?: mongoose.Types.ObjectId;
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
  instructions: string[];
  sets: Sets;
};

type HistorySets = {
  sets: number;
  reps: number;
  weight: number;
}[];

// types/workout.ts
export type ExerciseHistory = {
  name: string;
  primaryMuscle: string;
  sets: HistorySets;
};

export type WorkoutHistory = {
  name: string;
  date: Date; // Will store date only
  duration: number; // in minutes ( from the player)
  completedExercises: number;
  totalExercises: number;
  exercises: ExerciseHistory[];
};

// Base type that represents the structure of a workout (without Document)
export type BaseWorkout = {
  _id?: string;
  name: string;
  exercises: Exercise[];
  public: boolean;
  postDate?: Date;
  likes: string[];
  comments: {
    text: string;
    userId: string;
    name: string;
    pfpImageUrl: string;
    _id: mongoose.Types.ObjectId & string;
  }[];
  saves: string[];
};

// Extend BaseWorkout with Document for MongoDB operations
export type Workout = BaseWorkout & Document;

// NewWorkout for client-side use (without _id or Document properties)
export type NewWorkout = Omit<BaseWorkout, '_id'>;

export type FeedWorkout = {
  ownerId: string;
  ownerName: string;
  ownerPfpImageUrl: string;
} & BaseWorkout;

export type patchReqDataType = {
  name?: string;
  exerciseArr?: Exercise[];
  public?: boolean;
  comments?: Workout['comments'];
  sets?: Sets;
};
