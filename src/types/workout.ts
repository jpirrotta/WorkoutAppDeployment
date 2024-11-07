import mongoose, { Document } from 'mongoose';
import z from 'zod';

export const playerFormSchema = z.object({
  sets: z.array(
    z.object({
      reps: z.number(),
      weight: z.number(),
    })
  ),
});

type FlatSets = z.infer<typeof playerFormSchema>['sets'];

type Set = {
  sets: number;
  reps: number;
  weight: number;
};

type Exercise = {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
  instructions: string[];
  sets: Set[];
};

type WorkoutExercise = Exercise & Document;

// Base type that represents the structure of a workout (without Document)
type BaseWorkout = {
  _id?: mongoose.Types.ObjectId & string;
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
type Workout = BaseWorkout & Document;

// NewWorkout for client-side use (without _id or Document properties)
type NewWorkout = Omit<BaseWorkout, '_id'>;

type FeedWorkout = {
  ownerId: string;
  ownerName: string;
  ownerPfpImageUrl: string;
} & BaseWorkout;

type patchReqDataType = {
  name?: string;
  exerciseArr?: Exercise[];
  public?: boolean;
  comments?: Workout['comments'];
  sets?: Set[];
};

export type {
  Exercise,
  WorkoutExercise,
  FlatSets,
  Set,
  Workout,
  patchReqDataType,
  NewWorkout,
  FeedWorkout,
  BaseWorkout,
};
