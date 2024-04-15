'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Icons
import {StyledIcon} from '../StyledIcon';
import HeartOutline from '../svgs/heart-outline.svg';
import HeartFilled from '../svgs/heart-filled.svg';
import Checkmark from '../svgs/checkmark.svg';
import PlusSign from '../svgs/plus.svg';
import Trash from '../svgs/trash.svg';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';


export default function SocialWorkoutCard({ _id, userId, author, workout }) {
  const [isLiked, setIsLiked] = useState(workout.likes.includes(_id));
  const [likeCounter, setLikeCounter] = useState(workout.likes.length);
  const [isSaved, setIsSaved] = useState(workout.saves.includes(_id));

  const [comment, setComment] = useState('');  //current comment to be posted
  const [commentList, setCommentList] = useState([]);  //list of comments on the post


  const handleLikeWorkout = async () => {
    console.log('Like Workout');
    const response = await fetch('/api/workout/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: workout._id }),
    });

    if (response.ok) {
      setIsLiked(true);
      setLikeCounter(likeCounter + 1)
    }
  };
  
  const handleUnlikeWorkout = async () => {
    console.log('Unlike Workout');
    const response = await fetch('/api/workout/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: workout._id }),
    });

    if (response.ok) {
      setIsLiked(false);
      setLikeCounter(likeCounter - 1)
    }
  };
  
  const handleGetComments = async () => {
    console.log('get user');
    const response = await fetch(`/api/workout/comment?workoutId=${workout._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCommentList(data);
    }
  };

  const handleCommentWorkout = async () => {
    console.log('Comment Workout');
    if (!comment || comment.trim() === '') {
      console.log('The comment is empty');
    } 
    else {
      const response = await fetch('/api/workout/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          comment: comment,
          workoutId: workout._id,
        }),
      });

      if (response.ok) {
        setComment('');
        handleGetComments();
      }
    }
  };

  const handleDeleteComment = async ({commentId}) => {
    console.log('Delete Comment');

    const response = await fetch('/api/workout/comment', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        commentId: commentId, 
        workoutId: workout._id,
      })
    });

    if (response.ok) {
      console.log("comment deleted")
      //handleGetComments();
    }
  };

  const handleAddWorkout = async () => {
    console.log('Add Workout');
    workout = {
      name: workout.name,
      exercises: workout.exercises,
      public: false,
      likes: [],
      comments: [],
      saves: [],
    }
    const response = await fetch('/api/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId: userId, name: _id.name, workout: workout}),
    });

    if (response.ok) {
      setIsSaved(true);
    }
  };


  useEffect(() => {
    handleGetComments();
  }, []);

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
              <h1> {author}</h1>
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
                  {isLiked ? (
                    <StyledIcon
                      Icon={HeartFilled}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleUnlikeWorkout}
                    />
                  ) : (
                    <StyledIcon
                      Icon={HeartOutline}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleLikeWorkout}
                    />
                  )}
                </div>
                {likeCounter}
              </div>

              {/*Save workout*/}
              <div>
                {isSaved ? (
                    <StyledIcon
                      Icon={Checkmark}
                      w={'1.7rem'}
                    />
                  ) : (
                    <StyledIcon
                      Icon={PlusSign}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={handleAddWorkout}
                    />
                  )}
              </div>
            </div>

            {/*Comments*/}
            <div className="flex flex-col">
              <h1 className = "font-bold">Comments</h1>
              {commentList && commentList.map((comment, index) => (
                <div key={index} className="flex flex-row align-center justify-between">
                  <p>{comment.text}</p>
                  {/* TODO: Add delete comment functionality
                  {comment.postedBy === _id && (
                    <StyledIcon
                      Icon={Trash}
                      w={'1.7rem'}
                      className="text-primary hover:cursor-pointer"
                      onClick={() => handleDeleteComment(comment._id)}
                      />
                  )}*/}
                </div>
              ))}
            </div>

            <div className="flex flex-row">
              <Input 
                type="text" 
                value={comment} 
                onChange={e => setComment(e.target.value)} 
                placeholder="Add a comment..."
              />
              <Button onClick={handleCommentWorkout}>Post</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
  );
}