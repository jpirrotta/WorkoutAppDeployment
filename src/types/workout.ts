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

//exercise filters
export type ExerciseFilters = {
  bodyPart?: string[];
  target?: string[];
  equipment?: string[];
  secondaryMuscles?: string[];
};

export type Exercise = {
  _id?: string;
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

// Base type that represents the structure of a workout exercise for db since we will fetch exercise at time of usage based on id
export type workoutExercise = {
  _id?: string;
  id: string;
  sets: Sets;
}

// Base type that represents the structure of a workout (without Document)
export type BaseWorkout = {
  _id?: string;
  name: string;
  exercises: workoutExercise[];
  public: boolean;
  postDate?: Date;
  likes: {
    userId: string, 
    date: Date,
  }[];
  comments: {
    text: string;
    userId: string;
    name: string;
    pfpImageUrl: string;
    _id: mongoose.Types.ObjectId & string;
  }[];
  saves:  {
    userId: string, 
    date: Date,
  }[];
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
