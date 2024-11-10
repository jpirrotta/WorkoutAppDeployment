import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import { Exercise } from '@/types';
import AddExerciseToWorkout from './workout/AddExerciseToWorkout';
import logger from '@/lib/logger';

import { selectedExercisesAtom } from '@/store';
import { useAtom } from 'jotai';

import { Star } from 'lucide-react'; // Import the star icon

// Import the server action
import { useUser } from '@clerk/clerk-react';
import { useUserFavourites } from '@/hooks/exercises/getFavourites';
import useFavMutate from '@/hooks/exercises/setFav';

import PlayerExerciseForm from './workout/player/player-exercise-form';
import ExerciseSetsForm from './workout/ExerciseSetsForm';

type ExerciseCardProps = Readonly<{
  exercise: Exercise;
  closeIcon?: (exercise: Exercise) => React.ReactNode; // Changed from exerciseId
  CreateWorkoutFlag?: boolean;
  className?: string;
  isForm?: boolean;
  isPlaying?: boolean;
}>;

export default function ExerciseCard({
  exercise,
  closeIcon,
  CreateWorkoutFlag,
  className,
  isPlaying = false,
}: ExerciseCardProps) {
  const [showDemo, setShowDemo] = useState(true);
  const [SelectedExercises, setSelectedExercises] = useAtom(
    selectedExercisesAtom
  );
  const [isFavorited, setIsFavorited] = useState(false); // State to track if the exercise is favorited
  const [isSetsOpen, setIsSetsOpen] = useState(false); // State to track if the sets editing is needed
  const mutation = useFavMutate();
  const { user, isSignedIn, isLoaded } = useUser();

  const ImageToggler = () => {
    setShowDemo((prev) => !prev);
  };

  const onExerciseSelect = () => {
    if (CreateWorkoutFlag) {
      logger.info('Exercise selected');
      setSelectedExercises((prev) => {
        if (prev.includes(exercise)) {
          return prev.filter((currExe) => currExe.id !== exercise.id);
        }
        return [...prev, exercise];
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (!isSignedIn) return; // Only handle favorites if the user is signed in
    setIsFavorited((prev) => !prev);
    if (!isFavorited) {
      mutation.mutate({
        userId: user.id,
        exerciseId: exercise.id,
        option: 'add',
      });
    } else {
      mutation.mutate({
        userId: user.id,
        exerciseId: exercise.id,
        option: 'remove',
      });
    }
  };

  const {
    data: favExercises,
    isLoading,
    isError,
  } = useUserFavourites(user?.id);
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (!isLoading && !isError && favExercises) {
        if (favExercises.includes(exercise.id)) {
          setIsFavorited(true);
        }
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    exercise.id,
    favExercises,
    isLoading,
    isError,
  ]);

  return (
    <div className="cursor-pointer card-container" onClick={onExerciseSelect}>
      <Card
        className={cn(
          'bg-slate-700 border-primary md:transform md:hover:scale-105 md:transition-transform md:duration-200',
          className
        )}
        key={exercise.id}
      >
        {/* conditionally rendering close icon for exercise in workouts */}
        {closeIcon && <>{closeIcon(exercise)}</>}

        {/* conditionally rendered checkbox for letting user select exercise for new workout */}
        {CreateWorkoutFlag && (
          <div className="flex mt-2 mr-2 justify-end">
            <Checkbox
              className="rounded-sm"
              id={exercise.id}
              checked={SelectedExercises.includes(exercise)}
            />
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-secondary uppercase text-center">
              {exercise.name}
            </CardTitle>
            {isSignedIn && (
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle();
                }}
              >
                <Star
                  className={isFavorited ? 'text-yellow-500' : 'text-gray-500'}
                  fill={isFavorited ? 'currentColor' : 'none'}
                />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className={`${isSetsOpen && 'px-2'}`}>
          {!isSetsOpen ? (
            <>
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
                  <Button
                    className="px-0"
                    variant="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      ImageToggler();
                    }}
                  >
                    Hide Demo
                  </Button>
                </div>
              ) : (
                <Button
                  className="px-0"
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    ImageToggler();
                  }}
                >
                  Show Demo
                </Button>
              )}

              <CardDescription className="flex flex-col gap-1 text-secondary capitalize">
                {!isPlaying && (
                  <>
                    <span>
                      <strong>Target:</strong> {exercise.target}
                    </span>
                    <span>
                      <strong>Equipment:</strong> {exercise.equipment}
                    </span>
                    <span>
                      <strong>Body Part:</strong> {exercise.bodyPart}
                    </span>
                    <span className="pt-4">
                      <strong>Secondary Muscles:</strong>{' '}
                      {exercise.secondaryMuscles.join(', ')}
                    </span>
                  </>
                )}
                {/* Player Form */}
              </CardDescription>
              {isPlaying && <PlayerExerciseForm exercise={exercise} />}
            </>
          ) : (
            <ExerciseSetsForm
              exercise={exercise}
              setsFlag={isSetsOpen}
              setSetsFlag={setIsSetsOpen}
            />
          )}
        </CardContent>

        <CardFooter
          className={`${
            isSetsOpen && 'p-0'
          } capitalize px-2 text-secondary items-start flex flex-wrap gap-5`}
        >
          {/* conditionally show exercise details or sets */}
          {!isPlaying &&
            (isSetsOpen ? (
              <></>
            ) : (
              <>
                {/* modal trigger btn for adding exercise to desired workout */}
                <AddExerciseToWorkout
                  triggerNode={
                    <Button
                      className="px-2 w-full sm:w-auto flex-1"
                      variant="outline"
                    >
                      Add To Workout
                    </Button>
                  }
                  exerciseToAdd={exercise}
                />

                {/* sets show trigger */}
                {closeIcon && (
                  <Button
                    onClick={() => setIsSetsOpen(!isSetsOpen)}
                    variant="outline"
                    className="px-2 w-full sm:w-auto flex-1"
                  >
                    Adjust Sets
                  </Button>
                )}
              </>
            ))}
        </CardFooter>
      </Card>
    </div>
  );
}
