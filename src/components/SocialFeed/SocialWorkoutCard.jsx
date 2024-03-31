'use client';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/clerk-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

export default function SocialWorkoutCard({ workout }) {
    // use the useUser hook to get the current user
    const { user } = useUser();

    // critical default values
    const userId = user?.id;
    const userName = user?.fullName;
    const BodyData = {
      userId: userId,
      name: userName,
      workout: workout,
    };
  
    const handleLikeWorkout = async () => {
      console.log('Like Workout');
      const response = await fetch('/api/workout/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, workoutId: testWorkoutId }),
      });
    };
  
    const handleUnlikeWorkout = async () => {
      console.log('Unlike Workout');
      const response = await fetch('/api/workout/like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, workoutId: testWorkoutId }),
      });
    };
  
    const handleCommentWorkout = async () => {
      console.log('Comment Workout');
      const response = await fetch('/api/workout/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          comment: testComment,
          workoutId: testWorkoutId,
        }),
      });
    };
  
    const handleDeleteComment = async () => {
      console.log('Delete Comment');
      const response = await fetch('/api/workout/comment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          commentId: testCommentId,
          workoutId: testWorkoutId,
        }),
      });
    };


  return (
      <Card
        className="w-1/3 bg-slate-700 border-primary md:transform  md:transition-transform md:duration-200"
      >
        <CardHeader>
          <CardTitle className="text-secondary uppercase text-center">
            {workout.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-secondary capitalize">
            <h1>Description</h1>
          </CardDescription>


        </CardContent>

        <CardFooter className="capitalize text-secondary">
          <Button className="mr-4">
            Like
          </Button>
        </CardFooter>
      </Card>
  );
}