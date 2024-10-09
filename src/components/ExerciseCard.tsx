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
import { Checkbox } from "@/components/ui/checkbox"

import { Exercise } from '@/types';
import AddExerciseToWorkout from './workout/AddExerciseToWorkout';
import logger from '@/lib/logger';

import { selectedExercisesAtom } from '@/store';
import { useAtom } from 'jotai';

interface ExerciseCardProps {
  readonly exercise: Exercise;
  closeIcon?: (exerciseId: string) => React.ReactNode;
  CreateWorkoutFlag?: boolean;
}

export default function ExerciseCard({ exercise, closeIcon, CreateWorkoutFlag }: ExerciseCardProps) {
  const [showDemo, setShowDemo] = useState(true);
  const [SelectedExercises, setSelectedExercises] = useAtom(selectedExercisesAtom);

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
  }

  return (
    <div className='cursor-pointer' onClick={onExerciseSelect}>
      <Card
        className="bg-slate-700 border-primary md:transform md:hover:scale-105 md:transition-transform md:duration-200"
        key={exercise.id}
      >
        {/* conditionally rendered cross icon for letting user remove exercises from their workouts */}
        {closeIcon && (
          <>
            {closeIcon(exercise.id)}
          </>
        )}

        {/* conditionally rendered checkbox for letting user select exercise for new workout */}
        {CreateWorkoutFlag && (
          <div className='flex mt-2 mr-2 justify-end'>
            <Checkbox
              className='rounded-sm'
              id={exercise.id}
              checked={SelectedExercises.includes(exercise)} />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-secondary uppercase text-center">
            {exercise.name}
          </CardTitle>
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
    </div>
  );
}
