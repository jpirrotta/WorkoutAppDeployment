import mongoose from 'mongoose';

export type Exercise = {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
  instructions: string[];
};

export type Workout = {
  _id: mongoose.Types.ObjectId;
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
