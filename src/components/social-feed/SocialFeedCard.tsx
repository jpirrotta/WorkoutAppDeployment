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
  Download,
  SendHorizontal,
  Trash2 as Trash,
} from 'lucide-react';

// Components
import { Button } from '../ui/button';
import { Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { toast } from 'sonner';

interface SocialWorkoutCardProps {
  userId: string;
  workout: FeedWorkout;
  itemsPerPage: number;
  page: number;
}

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
  const mutateUncomment = usePublicWorkoutMutate('uncomment');
  const mutateSave = usePublicWorkoutMutate('save');

  const [commentPopoverVisible, setCommentPopoverVisible] = useState<string | null>(null); //State to manage comment popover visibility
  const [savePopoverVisible, setSavePopoverVisible] = useState(false); //State to manage comment popover visibility

  // Mutation handling ---------------------------------------
  const handleLikeWorkout = async () => {
    logger.info('Attempting to like workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    if (workout.likes?.some(like => like.userId === userId)) {
      console.error('User has already likes the workout');
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

    if (!workout.likes?.some(like => like.userId === userId)) {
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
    setCommentPopoverVisible(null);
    mutateComment.mutate({ userId, workout, commentText, itemsPerPage, page });
    logger.info('Commenting on workout complete!');
  };

  const handleDeleteComment = async (commentId: string) => {
    logger.info('Attempting to remove comment from workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }

    mutateUncomment.mutate({ userId, workout, page, itemsPerPage, commentId });
    logger.info('Remove comment from workout complete!');
  };

  const handleSaveWorkout = async () => {
    console.log('Attempting to save workout...');
    if (!workout || !workout._id) {
      console.error('Workout is null or undefined');
      return;
    }
    setSavePopoverVisible(false);
    mutateSave.mutate({ userId, workout, page, itemsPerPage }, { 
      onSuccess: (data) => {
        if (data) {
          console.log('Workout saved successfully');
          toast.success('Successfully saved workout', {
              description: 'You can view the workout in your library',
            });
          return;
        }
        else {
          console.log(`Error saving workout, copy already exists in user's library`);
          toast.info('You already have a copy of this workout in your library');
          return;
        }
      },
      onError: (error) => {
        console.error('Error saving workout: ', error);
      }
    });
  };
  // End of mutation handling --------------------------------


  // Utility Functions ---------------------------------------
  const timeAgo = (date: Date) => {  // Function to calculate how long ago the post was made
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
  // End of utility functions --------------------------------


  return (
    <Card className="w-4/5 lg:w-1/3 md:w-1/2 sm:w-2/3 border-primary bg-background dark:bg-background text-black dark:text-white">

      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center justify-between">
          <div className="flex flex-row gap-x-2 items-center">
            <Avatar>
              <AvatarImage src={workout.ownerPfpImageUrl} alt="profile picture"/>  
            </Avatar>
            <h1>{workout.ownerName}</h1>
          </div>
          {workout.postDate &&
            <h1>{timeAgo(workout.postDate)}</h1>
          }
        </div>
        <CardTitle>{workout.name}</CardTitle>
      </CardHeader>

      <CardContent className="pb-2 ">
        <Carousel className="ml-8 mr-8">
          <CarouselContent>
            {workout.exercises?.map((exercise: Exercise) => (
              <CarouselItem key={exercise.id} className="text-center">
                <Image src={exercise.gifUrl} alt={exercise.name} width="350" height="350" className="rounded-lg mx-auto" unoptimized/>
                <h1>{capitalizeFirstLetterOfEachWord(exercise.name)}</h1>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="flex flex-row w-full justify-between items-center">
            {/*Like workout and like counter*/}
            <div className="flex flex-row gap-4 items-center">
              <div>
                {workout.likes.some(like => like.userId === userId) ? (
                  <Heart size={32}
                  className="text-primary fill-current hover:cursor-pointer"
                  onClick={handleUnlikeWorkout}/>
                ) : (
                  <Heart size={32}
                  className="text-primary hover:cursor-pointer"
                  onClick={handleLikeWorkout}/>
                )}
              </div>
              <p className="text-black dark:text-white">{workout.likes.length}</p>
            </div>

            {/*Save workout and save counter*/}
            <div className="flex flex-row gap-4 items-center">
              {/*Display functional save workout button if the workout does not belong to the current user, otherwise display download icon with no functionality*/}
              {workout.ownerId != userId ? (
                <Popover open={savePopoverVisible} onOpenChange={setSavePopoverVisible}>
                <PopoverTrigger onClick={() => workout.ownerId != userId && setSavePopoverVisible(true)}>
                  <Download size={32} color="gray"/>
                </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-center pb-4">Save workout to library?</p>
                    <section className="flex flex-row justify-center gap-6">
                      <Button variant="secondary" onClick={() => setSavePopoverVisible(false)}> Cancel </Button>
                      <Button variant="default" onClick={() => handleSaveWorkout()}> Confirm </Button>
                    </section>
                  </PopoverContent>
                </Popover>
              ) : (
                <Download size={32} color="gray"/>
              )}
              <p className="text-black dark:text-white">{workout.saves.length}</p>
            </div>
          </div>      
      </CardContent>

      {/*Comments*/}
      <CardFooter className="block text-secondary gap-4">
        <button onClick={toggleCommentsVisibility} className="font-style: italic text-gray-500 hover:underline">
          {commentsVisible ? 'Hide Comments' : 'View Comments'}
        </button>
        
        {commentsVisible && (
          <div className="mt-4">
            {/*Display comments*/}
            {workout.comments?.map((comment, index) => (
              <section key={index} className="flex flex-row mb-2 gap-2 items-center text-black dark:text-white">
                <Avatar className="h-7 w-7 self-start ml-1 mt-1">
                  <AvatarImage src={comment.pfpImageUrl} alt="profile picture"/>  
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xs font-bold" style={{overflowWrap: 'anywhere'}}>{comment.name}</p>
                  <p className="text-sm font-normal" style={{overflowWrap: 'anywhere'}}>{comment.text}</p>
                </div>
                {/*Display delete comment button if the comment belongs to the current user*/}
                {(comment.userId == userId || workout.ownerId == userId) && 
                  <Popover open={commentPopoverVisible == comment._id.toString()} onOpenChange={(open) => setCommentPopoverVisible(open ? comment._id.toString() : null)}>
                    <PopoverTrigger className="ml-auto mt-2 self-start" onClick={() => setCommentPopoverVisible(comment._id)}>
                      <Trash size={16}/>
                    </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-center pb-4">Are you sure you want to delete this comment?</p>
                        <section className="flex flex-row justify-center gap-6">
                          <Button variant="secondary" onClick={() => setCommentPopoverVisible(null)}> Cancel </Button>
                          <Button variant="default" onClick={() => handleDeleteComment(comment._id.toString())}> Confirm </Button>
                        </section>
                      </PopoverContent>
                  </Popover>
                }
              </section>
            ))}

            {/*Add comment form*/}
            <form className="flex flex-row gap-2" onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                handleCommentWorkout();
                setCommentText(''); //Clear the input field after submission
              }}>

              <div className="relative flex-grow">
                <Input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment"
                  className="input-class pr-10 text-black dark:text-white"
                  required 
                />
                <button type="submit" className="absolute right-0 top-0 mt-2 mr-2 hover:cursor-pointer">
                  <SendHorizontal size={26} color="red"/>
                </button>
              </div>
            </form>
          </div>
        )}  
      </CardFooter>
    </Card>
  );
}
