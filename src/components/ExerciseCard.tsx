import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddExerciseToWorkout from './workout/AddExerciseToWorkout';
import { Exercise } from '@/types';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // Import the star icon
import { addFavoriteExercise, removeFavoriteExercise } from '@/actions/favExercises'; // Import the server action
import { useUser } from '@clerk/clerk-react';
import { useUserFavourites } from '@/hooks/exercises/getFavourites';

type ExerciseCardProps = {
  readonly exercise: Exercise;
  closeIcon?: (exerciseId: string) => React.ReactNode;
  className?: string;
};

export default function ExerciseCard({
  exercise,
  closeIcon,
  className,
}: ExerciseCardProps) {
  const [showDemo, setShowDemo] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false); // State to track if the exercise is favorited

  const { user, isSignedIn, isLoaded } = useUser();

  const ImageToggler = () => {
    setShowDemo((prev) => !prev);
  };

  const handleFavoriteToggle = () => {
    if (!isSignedIn) return; // Only handle favorites if the user is signed in

    setIsFavorited((prev) => !prev);
    if (!isFavorited) {
      addFavoriteExercise(user.id, exercise.id);
    } else {
      removeFavoriteExercise(user.id, exercise.id);
    }
  };

  const { data: favExercises, isLoading, isError } = useUserFavourites(user?.id);
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (!isLoading && !isError && favExercises) {
        if (favExercises.includes(exercise.id)) {
          setIsFavorited(true);
        }
      }
    }
  }, [isLoaded, isSignedIn, user, exercise.id, favExercises, isLoading, isError]);

  return (
    <Card
      className={cn(
        'bg-slate-700 border-primary md:transform md:hover:scale-105 md:transition-transform md:duration-200',
        className
      )}
      key={exercise.id}
    >
      {closeIcon && <>{closeIcon(exercise.id)}</>}

      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-secondary uppercase text-center">
            {exercise.name}
          </CardTitle>
          {isSignedIn && (
            <Button variant="link" onClick={handleFavoriteToggle}>
              <Star
                className={isFavorited ? 'text-yellow-500' : 'text-gray-500'}
                fill={isFavorited ? 'currentColor' : 'none'}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showDemo ? (
          <div className="flex justify-center items-center flex-col">
            <Image
              src={exercise.gifUrl}
              alt={exercise.name}
              width={350}
              height={125}
              className="rounded-md"
              unoptimized
            />
            <Button className="px-0" variant="link" onClick={ImageToggler}>
              Hide Demo
            </Button>
          </div>
        ) : (
          <Button className="px-0" variant="link" onClick={ImageToggler}>
            Show Demo
          </Button>
        )}
        <CardDescription className="text-secondary capitalize">
          <strong>Target:</strong> {exercise.target}
          <br />
          <strong>Equipment:</strong> {exercise.equipment}
          <br />
          <strong>Body Part:</strong> {exercise.bodyPart}
          <br />
        </CardDescription>
        <br />

        {/* modal trigger btn for adding exercise to desired workout */}
        <AddExerciseToWorkout
          triggerNode={
            <Button className="px-0" variant="link">
              Add To Workout
            </Button>
          }
          exerciseToAdd={exercise}
        />
      </CardContent>

      <CardFooter className="capitalize text-secondary">
        <strong>Secondary Muscles:&nbsp;</strong>
        {exercise.secondaryMuscles.join(', ')}
      </CardFooter>
    </Card>
  );
}