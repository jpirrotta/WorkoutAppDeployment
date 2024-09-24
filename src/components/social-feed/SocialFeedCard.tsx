'use client';
import React, { useState, useEffect } from 'react';
import UserModel from '@/models/userSchema';
import { UserDocument } from '@/models/userSchema';

// Hooks
import usePublicWorkoutMutate from '@/hooks/workouts/usePublicWorkoutMutate';

// Icons
import { StyledIcon } from '../StyledIcon';
import { 
  LoaderCircle,
  Heart, 
  HeartOff,
  Check,
  Plus,
  Trash2 as Trash
} from 'lucide-react';


// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeedWorkout } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



interface SocialWorkoutCardProps {
  userId: string;
  initialWorkout: FeedWorkout;
}

export default function SocialWorkoutCard({userId, initialWorkout}: SocialWorkoutCardProps) {
  const mutationLike = usePublicWorkoutMutate('like');
  const mutationUnlike = usePublicWorkoutMutate('unlike');
  const mutationComment = usePublicWorkoutMutate('addComment');
  //const mutationUncomment = usePublicWorkoutMutate('removeComment');
  const mutationSave = usePublicWorkoutMutate('save');
  const mutationUnsave = usePublicWorkoutMutate('unsave');


  const [workout, setWorkout] = useState<FeedWorkout>(initialWorkout);
  const [commentText, setCommentText] = useState("");

  const handleLikeWorkout = async () => {
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (workout.likes?.includes(userId)) {
      console.error('User already liked the workout');
      return;
    }

    //TO DO: state type as explicitly bool?
    const isSuccess = await mutationLike.mutateAsync({userId, workout});
    if (isSuccess) {
      setWorkout((prevWorkout: FeedWorkout) => ({
        ...prevWorkout,
        likes: [...prevWorkout.likes, userId],
      }));
      console.log("Successfully liked workout");
    }
  };
  
  const handleUnlikeWorkout = async () => {
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (!workout.likes?.includes(userId)) {
      console.error('User has not liked the workout, so it cannot be unliked');
      return;
    }

    //TO DO: state type as explicitly bool?
    let isSuccess: any = await mutationUnlike.mutateAsync({userId, workout});
    if (isSuccess) {
      setWorkout((prevWorkout: FeedWorkout) => ({
        ...prevWorkout,
        likes: prevWorkout.likes.filter((id) => id !== userId),
      }));
      console.log("Successfully unliked workout");
    }
  };
  
  const handleSubmitComment = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleCommentWorkout();
  };

  const handleCommentWorkout = async () => {
    console.log('Comment Workout');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }

    let isSuccess: any = await mutationComment.mutateAsync({userId, workout, commentText});
  };

  /*const handleDeleteComment = async (commentId: mongoose.Types.ObjectId) => {
    console.log('Delete Comment');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
  
    let isSuccess: any = await mutationUncomment.mutateAsync({ userId, workout, commentText });
    console.log("is success: ", isSuccess);
    if (isSuccess) {
      setWorkout((prevWorkout: FeedWorkout) => ({
        ...prevWorkout,
        comments: prevWorkout.comments.filter(comment => comment._id !== commentId)
      }));
      console.log("Successfully removed the comment from the workout");
    }
  };*/

  const handleSaveWorkout = async () => {
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (workout.saves?.includes(userId)) {
      console.error('User already saved the workout');
      return;
    }

    //TO DO: state type as explicitly bool?
    let isSuccess: any = await mutationSave.mutateAsync({userId, workout});
    if (isSuccess) {
      setWorkout((prevWorkout: FeedWorkout) => ({
        ...prevWorkout,
        saves: [...prevWorkout.saves, userId],
      }));
      console.log("Successfully saved workout");
    }
  };
  
  const handleUnsaveWorkout = async () => {
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (!workout.saves?.includes(userId)) {
      console.error('User has not saved the workout, so it cannot be unsaved');
      return;
    }

    //TO DO: state type as explicitly bool?
    let isSuccess: any = await mutationUnsave.mutateAsync({userId, workout});
    if (isSuccess) {
      setWorkout((prevWorkout: FeedWorkout) => ({
        ...prevWorkout,
        saves: prevWorkout.saves.filter((id) => id !== userId),
      }));
      console.log("Successfully unsaved workout");
    }
  };



  return (
      <Card className="w-1/3 bg-slate-700 border-primary md:transform  md:transition-transform md:duration-200">
        <CardHeader>
          <CardTitle className="text-secondary uppercase text-center">
            <p>{workout.name}</p>

          </CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-secondary">
            <div className = "flex flex-row gap-2">
              <h1 className = "font-bold">Posted by: </h1>
              <h1> {workout.ownerName}</h1>
            </div>
            <div className = "flex flex-row w-full gap-2">
              <h1 className = "font-bold">Exercises:</h1>
              {workout.exercises && workout.exercises.map((exercise, index) => (
                <div key={index}>
                  <p>{exercise.name}{workout.exercises.length === index + 1 ? null : ','}</p>
                </div>
              ))}
            </div>
           </CardDescription>
        </CardContent>

        <CardFooter className="capitalize text-secondary">
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-row w-full justify-between items-center">
              {/*Like workout and like counter*/}
              <div className="flex flex-row gap-4">
                <div>
                  {workout.likes.includes(userId) ? (
                    <StyledIcon
                      Icon={HeartOff}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleUnlikeWorkout}
                    />
                  ) : (
                    <StyledIcon
                      Icon={Heart}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleLikeWorkout}
                    />
                  )}
                </div>
                {workout.likes.length}
              </div>

              {/*Save workout*/}
              <div className="flex flex-row gap-4">
                <div>
                  {workout.saves.includes(userId) ? (
                    <StyledIcon
                      Icon={Check}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleUnsaveWorkout}
                    />
                  ) : (
                    <StyledIcon
                      Icon={Plus}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleSaveWorkout}
                    />
                  )}
                </div>
                {workout.saves.length}
              </div>

            </div>

            {/*Comments*/}
            <div className="flex flex-col">
              <h1 className = "font-bold">Comments</h1>
              {workout.comments?.map((comment, index) => (
                <div key={index} className="flex flex-row align-center justify-between">
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitComment} className="flex flex-row gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment"
              className="input-class" // Replace with actual class names
            />
            <button type="submit" className="button-class">Comment</button> {/* Replace with actual class names */}
          </form>

          </div>
        </CardFooter>
      </Card>
  );
  
}