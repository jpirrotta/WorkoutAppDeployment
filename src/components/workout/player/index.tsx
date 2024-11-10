'use client';
import { useEffect, useState } from 'react';
import { WorkoutProgress } from '@/components/workout/player/workout-player-progressbar';
import ExerciseCard from '@/components/ExerciseCard';
import WorkoutPlayerCommandMenu from '@/components/workout/player/player-command-menu';
import Stopwatch from '@/components/workout/player/stopwatch';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  totalExercisesAtom,
  carouselApiAtom,
  currentExerciseIndexAtom,
  exerciseStatesAtom,
  exerciseFormValuesAtom,
  isAllExercisesCompletedAtom,
} from '@/store';
import { Exercise, Sets, FlatSets } from '@/types';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useWorkoutExerciseUpdate } from '@/hooks/workout/useWorkoutMutations';
import { flattenSets, getChangedExerciseIds } from '@/lib/workout';
import { forEach } from 'lodash';

export default function WorkoutPlayer({ id }: { id: string }) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalExercisesAtom);
  const setCurrentExerciseIndex = useSetAtom(currentExerciseIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const exerciseFormValues = useAtomValue(exerciseFormValuesAtom);
  const [isAllExercisesCompleted] = useAtom(isAllExercisesCompletedAtom);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  const { mutate: updateExerciseSets } = useWorkoutExerciseUpdate();

  const changedIds = getChangedExerciseIds(exercises, exerciseFormValues);

  const { data } = useGetAllWorkouts();

  // console.log('id', id);

  console.log('exercises', exercises);

  const handleUpdateExerciseSets = async () => {
    // TODO if the user wants to save the changes to the workout
    // we can call the mutation to update the workout
    // and pass the changedIds to update only the exercises that have changed
    // if the user doesn't want to save the changes we just save the data to his history  
    forEach(exerciseFormValues, (sets, exerciseId) => {
      console.log('exerciseId', exerciseId);
      console.log('sets', sets);
      updateExerciseSets({ workoutId: id, exerciseId, sets });
    });
    setIsWorkoutCompleted(false);
  };

  // Initialize exercise states
  useEffect(() => {
    for (const exercise of exercises) {
      if (!exerciseStates[exercise._id!.toString()]) {
        const flatSets = flattenSets(exercise.sets);
        setExerciseStates((prev) => ({
          ...prev,
          [exercise._id!.toString()]: {
            numberOfSets: flatSets.length,
            completedSets: new Array(flatSets.length).fill(undefined),
          },
        }));
      }
    }
    console.log('exerciseStates', exerciseStates);
  }, [exercises, exerciseStates, setExerciseStates]);

  useEffect(() => {
    console.log('isAllExercisesCompleted', isAllExercisesCompleted);
    if (isAllExercisesCompleted) {
      setIsWorkoutCompleted(true);
      console.log('exerciseFormValues', exerciseFormValues);
    }
  }, [isAllExercisesCompleted, exerciseFormValues, exercises]);

  useEffect(() => {
    if (data) {
      const workout = data.find((val) => val._id === id);
      if (workout && workout.exercises) {
        setExercises(workout.exercises);
        setTotalSteps(workout.exercises.length);
      }
    }
  }, [data, id, setTotalSteps]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('init', () => {
      console.log('Carousel initialized');
    });

    api.on('select', () => {
      setCurrentExerciseIndex(api.selectedScrollSnap());
    });
  }, [api, setCurrentExerciseIndex]);

  return (
    <section
      id="workout-player"
      className="flex flex-col items-center justify-between gap-4"
    >
      <Stopwatch />
      <WorkoutProgress steps={totalSteps} className="w-[80%] sm:w-[60%]" />

      <div className="w-[90%] sm:w-[65%] overflow-hidden sm:overflow-visible px-4">
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-90%">
          <CarouselContent className="flex gap-4">
            {exercises.map((exercise) => (
              <CarouselItem
                key={exercise._id!.toString()}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                {/* Adjust width */}
                <ExerciseCard
                  className="!transform-none !transition-none"
                  exercise={exercise}
                  isPlaying
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <WorkoutPlayerCommandMenu exercises={exercises} />

      <AlertDialog
        open={isWorkoutCompleted}
        onOpenChange={() => setIsWorkoutCompleted(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle asChild>
              <div className="flex justify-between">
                <h2>Workout Completed</h2>
                {!!changedIds.size && (
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">save changes</Label>
                  </div>
                )}
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            You have completed the workout. Do you want to submit your results?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              onClick={() => setIsWorkoutCompleted(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={() => {
                handleUpdateExerciseSets();
              }}
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
