import mongoose, { Document } from 'mongoose';

type Exercise = {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl: string;
};

// Base type that represents the structure of a workout (without Document)
type BaseWorkout = {
  _id: mongoose.Types.ObjectId & string;
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
  exercise?: Exercise;
  public?: boolean;
  comments?: Workout['comments'];
};

export type { Exercise, Workout, patchReqDataType, NewWorkout, FeedWorkout, BaseWorkout };