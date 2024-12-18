'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  resetPlayerAtoms,
  totalExercisesAtom,
  carouselApiAtom,
  currentExerciseIndexAtom,
  exerciseStatesAtom,
  exerciseFormValuesAtom,
  isAllExercisesCompletedAtom,
  workoutDurationAtom,
} from '@/store';
import { Exercise } from '@/types';
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

import {
  useWorkoutExerciseUpdate,
  useWorkoutHistorySave,
} from '@/hooks/workout/useWorkoutMutations';
import { flattenSets, hasExerciseChanges } from '@/lib/workout';
import { forEach } from 'lodash';
import { collectWorkoutHistoryData } from '@/lib/workout';
import { useRouter } from 'next/navigation';
import { useExercises } from '@/utils/fetchData';
import { toast } from 'sonner';
import logger from '@/lib/logger';

export default function WorkoutPlayer({ id }: { id: string }) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalExercisesAtom);
  const setCurrentExerciseIndex = useSetAtom(currentExerciseIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const exerciseFormValues = useAtomValue(exerciseFormValuesAtom);
  const [isAllExercisesCompleted] = useAtom(isAllExercisesCompletedAtom);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);
  const [saveChangesSelected, setSaveChangesSelected] = useState(false);
  const duration = useAtomValue(workoutDurationAtom);
  const resetPlayerStates = useSetAtom(resetPlayerAtoms);

  // get all exercises
  const { data: allExercises, error } = useExercises();

  const { mutate: updateExerciseSets } = useWorkoutExerciseUpdate();
  const { mutate: saveToHistory } = useWorkoutHistorySave();
  const router = useRouter();

  const { data } = useGetAllWorkouts();

  useEffect(() => {
    if (error) {
      toast.error('Seems like there was an issue getting your Exercises :(', {
        description: error.message,
      });
    }

    if (allExercises) {
      logger.info(`Fetched ${allExercises.length} exercises`);

      // get the workout to be played, it will never be undefined
      const workoutToBePlayed = data?.find((val) => val._id === id);

      if (!workoutToBePlayed) {
        logger.error(`No workout found with id ${id}`);
        return;
      }

      // filter the exercises that are in the workout
      const filteredExercises = workoutToBePlayed.exercises.map((exercise) => {
        // overriding the exercise we are finding since we are sure that it exists
        const workoutExe = allExercises.find((e) => e.id === exercise.id)!;

        return {
          _id: exercise._id,
          ...workoutExe,
          sets: exercise?.sets || [],
        }
      })

      if (filteredExercises.length > 0) {
        setExercises(filteredExercises);
      }
      else {
        logger.error(`No exercises found in the workout`);
      }
    }
  }
    , [error, allExercises, data, id]);

  const shouldUpdateWorkoutSets = useMemo(() => {
    return hasExerciseChanges(exercises, exerciseFormValues);
  }, [exercises, exerciseFormValues]);

  const handleUpdateExerciseSets = async () => {
    // we can call the mutation to update the workout
    // and pass the changedIds to update only the exercises that have changed
    // if the user doesn't want to save the changes we just save the data to his history
    if (shouldUpdateWorkoutSets && saveChangesSelected) {
      // if a change has been made to the exercises sets we update the workout
      forEach(exerciseFormValues, (sets, exerciseId) => {
        updateExerciseSets({
          workoutId: id,
          exerciseId,
          sets,
        });
      });
    }

    // Collect history data
    const historyData = collectWorkoutHistoryData(
      {
        _id: id,
        name: data?.find((val) => val._id === id)?.name ?? '',
        exercises,
      },
      exerciseStates,
      exerciseFormValues,
      duration
    );
    console.log('historyData', historyData);
    // Save the workout to history
    saveToHistory(historyData);

    // Reset player states and atoms after saving the workout
    setIsWorkoutCompleted(false);
    resetPlayerStates();
    // Redirect back to the workouts page
    router.back();
  };

  const handleCancelWorkout = () => {
    setIsWorkoutCompleted(false);
    resetPlayerStates();
    router.back();
  };

  // Initialize exercise states
  useEffect(() => {
    if (!data) return;
    // state setup
    const workout = data.find((val) => val._id === id);
    if (!workout?.exercises) return;

    setTotalSteps(workout.exercises.length);

    // Initialize exercise states
    workout.exercises.forEach((exercise) => {
      const exerciseId = exercise._id!.toString();
      if (exerciseStates[exerciseId]) return;

      const flatSets = flattenSets(exercise.sets);
      setExerciseStates((prev) => ({
        ...prev,
        [exerciseId]: {
          numberOfSets: flatSets.length,
          completedSets: new Array(flatSets.length).fill(undefined),
        },
      }));
    });
  }, [data, id, setTotalSteps, exerciseStates, setExerciseStates]);

  useEffect(() => {
    console.log('isAllExercisesCompleted', isAllExercisesCompleted);
    if (isAllExercisesCompleted) {
      setIsWorkoutCompleted(true);
      console.log('exerciseFormValues', exerciseFormValues);
    }
  }, [isAllExercisesCompleted, exerciseFormValues, exercises]);

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
                {shouldUpdateWorkoutSets && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={saveChangesSelected}
                      onCheckedChange={setSaveChangesSelected}
                    />
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
            <AlertDialogCancel type="button" onClick={handleCancelWorkout}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="button" onClick={handleUpdateExerciseSets}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
