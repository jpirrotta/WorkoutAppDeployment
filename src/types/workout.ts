import mongoose, { Document } from 'mongoose';

export type Exercise = {
  id: string;
  bodyPart: string;
  equipment: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
};

export type Workout = Document & {
  _id: mongoose.Types.ObjectId & string;
  name: string;
  exercises: Exercise[];
  public: boolean;
  likes: mongoose.Types.ObjectId[];
  comments: {
    text: string;
    postedBy: mongoose.Types.ObjectId;
  }[];
  saves: mongoose.Types.ObjectId[];
};