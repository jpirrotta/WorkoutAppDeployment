'use client';
import React, { useState } from 'react';
import logger from '@/lib/logger';

// Types
import { FeedWorkout, Exercise } from '@/types';

// Hooks
import usePublicWorkoutMutate from '@/hooks/public-workout/usePublicWorkoutMutate';

// Icons
import {
  Heart,
  Bookmark,
  Plus,
  Trash2 as Trash,
} from 'lucide-react';

// Components
import { Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';


interface SocialWorkoutCardProps {
  userId: string;
  workout: FeedWorkout;
  itemsPerPage: number;
  page: number;
}

const EMPTY_AVATAR_URL = "https://ui-avatars.com/api/?name=Placeholder&background=random";

export default function SocialWorkoutCard({
  userId,
  workout,
  itemsPerPage,
  page,
}: SocialWorkoutCardProps) {
  const [commentText, setCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState(false);

  const toggleCommentsVisibility = () => {
    setCommentsVisible(!commentsVisible);
  };


  const mutateLike = usePublicWorkoutMutate('like');
  const mutateUnlike = usePublicWorkoutMutate('unlike');
  const mutateComment = usePublicWorkoutMutate('comment');
  //const mutateUncomment = usePublicWorkoutMutate('uncomment');
  const mutateSave = usePublicWorkoutMutate('save');
  const mutateUnsave = usePublicWorkoutMutate('unsave');


  // Mutation handling ---------------------------------------
  const handleLikeWorkout = async () => {
    logger.info('Attempting to like workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (workout.likes?.includes(userId)) {
      console.error('User already liked the workout');
      return;
    }
    
    mutateLike.mutate({ userId, workout, itemsPerPage, page });
    logger.info('Like workout complete!');
  };

  const handleUnlikeWorkout = async () => {
    logger.info('Attempting to unlike workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (!workout.likes?.includes(userId)) {
      console.error('User has not liked the workout, so it cannot be unliked');
      return;
    }

    mutateUnlike.mutate({ userId, workout, itemsPerPage, page });
    logger.info('Unlike workout complete!');
  };

  const handleCommentWorkout = async () => {
    logger.info('Attempting to comment on workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }

    mutateComment.mutate({ userId, workout, commentText, itemsPerPage, page });
    logger.info('Commenting on workout complete!');
  };

  //TO DO: Implement delete comment functionality
  /*const handleDeleteComment = async (commentId: string) => {
    logger.info('Attempting to remove comment from workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }

    mutateUncomment.mutate({ userId, workout, commentId, itemsPerPage, page });
    logger.info('Remove comment from workout complete!');
  };*/

  const handleSaveWorkout = async () => {
    logger.info('Attempting to save workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (workout.saves?.includes(userId)) {
      console.error('User already saved the workout');
      return;
    }

    mutateSave.mutate({ userId, workout, page, itemsPerPage });
    logger.info('Save workout complete!');
  };

  const handleUnsaveWorkout = async () => {
    logger.info('Attempting to unsave workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (!workout.saves?.includes(userId)) {
      console.error('User has not saved the workout, so it cannot be unsaved');
      return;
    }

    mutateUnsave.mutate({ userId, workout, page, itemsPerPage });
    logger.info('Unsave workout complete!');
  };
  // End of mutation handling ------------------------------



  // UTILITY FUNCTIONS --------------------------------------

  // Function to calculate how long ago the post was made
  const timeAgo = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 20) {
      return postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };

  const capitalizeFirstLetterOfEachWord = (str: string): string => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };


  return (
    <Card className="w-1/3 border-primary bg-background dark:bg-background text-black dark:text-white">

      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center justify-between">
          <div className="flex flex-row gap-x-2 items-center">
            <Avatar>
              <AvatarImage src={EMPTY_AVATAR_URL} alt={workout.ownerName}/>  
              <AvatarFallback>{workout.ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1>{workout.ownerName}</h1>
          </div>
          {workout.postDate &&
            <h1>{timeAgo(workout.postDate)}</h1>
          }
        </div>
        <CardTitle>{workout.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <Carousel className="ml-8 mr-8">
          <CarouselContent>
            {workout.exercises?.map((exercise: Exercise) => (
              <CarouselItem key={exercise.id} className="text-center">
                <img src={exercise.gifUrl} alt={exercise.name} className="rounded-lg mx-auto"/>
                <h1>{capitalizeFirstLetterOfEachWord(exercise.name)}</h1>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <CardDescription className="text-secondary">
        </CardDescription>
      </CardContent>

      <CardFooter className="capitalize text-secondary">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-row w-full justify-between items-center">
            {/*Like workout and like counter*/}
            <div className="flex flex-row gap-4 items-center">
              <div>
                {workout.likes.includes(userId) ? (
                  <Heart color="red" fill="red" size={32}
                  className="text-primary hover:cursor-pointer"
                  onClick={handleUnlikeWorkout}/>

                ) : (
                  <Heart color="red" size={32}
                  className="text-primary hover:cursor-pointer"
                  onClick={handleLikeWorkout}/>
                )}
              </div>
              <p className="text-black dark:text-white">{workout.likes.length}</p>
            </div>

            {/*Save workout*/}
            <div className="flex flex-row gap-4 items-center">
              <div>
                {workout.saves.includes(userId) ? (
                  <Bookmark color="white" fill="white" size={32}
                  className="text-primary hover:cursor-pointer"
                  onClick={handleUnsaveWorkout}/>
                ) : (
                  <Bookmark color="white" size={32}
                  className="text-primary hover:cursor-pointer"
                  onClick={handleSaveWorkout}/>
                )}
              </div>
              <p className="text-black dark:text-white">{workout.saves.length}</p>
            </div>
          </div>

          {/*Comments*/}
          <div>
            <button onClick={toggleCommentsVisibility} className="font-style: italic text-gray-500 hover:underline">
              {commentsVisible ? 'Hide Comments' : 'View Comments'}
            </button>
            {commentsVisible && (
              <div className="mt-4">
                {/*Display comments*/}
                <div className="mb-4">
                  {workout.comments?.map((comment, index) => (
                      <p className="text-black dark:text-white">{comment.text}</p>
                  ))}
                </div>

                {/*Add comment form*/}
                <form onSubmit={(e) => {
                    e.preventDefault(); // Prevent the default form submission behavior
                    handleCommentWorkout();
                    setCommentText('');  //Clear the input field after submission
                  }}
                    className="flex flex-row gap-2"
                  >
                  <Input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                    className="input-class"
                    required 
                  />
                  <button type="submit" className="button-class text-black dark:text-white">
                    +
                  </button>
                </form>
              </div>
              
            )}
          </div>


        
        </div>
      </CardFooter>
    </Card>
  );
}
