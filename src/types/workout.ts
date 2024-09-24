import mongoose from 'mongoose';

export type Exercise = {
  id: string;
  bodyPart: string;
  equipment: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
};

export type Workout = {
  _id: mongoose.Types.ObjectId;
  name: string;
  exercises: Exercise[];
  public: boolean;
  likes: string[];
  comments: {
    text: string;
    postedBy: mongoose.Types.ObjectId;
  }[];
  saves: string[];
};

export type FeedWorkout = {
  ownerId: string;
  ownerName: string;
} & Workout;
