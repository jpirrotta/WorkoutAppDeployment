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

export const exerciseSetsSchema = z.object({
  sets: z.array(
    z.object({
      sets: z.number().min(1),
      reps: z.number().min(1),
      weight: z.number().min(0),
    })
  ),
});

type FlatSets = z.infer<typeof playerFormSchema>['sets'];

type Set = z.infer<typeof exerciseSetsSchema>['sets'];

type Exercise = {
  _id?: mongoose.Types.ObjectId;
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
  instructions: string[];
  sets: Set;
};

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
  FlatSets,
  Set,
  Workout,
  patchReqDataType,
  NewWorkout,
  FeedWorkout,
  BaseWorkout,
};
