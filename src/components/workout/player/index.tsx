'use client';
import { useEffect, useState } from 'react';
import { WorkoutProgress } from '@/components/workout/player/workout-player-progressbar';
import ExerciseCard from '@/components/ExerciseCard';
import WorkoutPlayerCommandMenu from '@/components/workout/player/player-command-menu';
import Stopwatch from '@/components/workout/player/stopwatch';
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
import { Exercise, Set, FlatSets } from '@/types';
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

// TODO remove once we have the actual data
// eslint-disable-next-line react-hooks/exhaustive-deps
const mockWorkoutData = [
  {
    sets: [
      {
        sets: 1,
        reps: 10,
        weight: 50,
      },
      {
        sets: 1,
        reps: 8,
        weight: 55,
      },
    ],
  },
  {
    sets: [
      {
        sets: 1,
        reps: 8,
        weight: 30,
      },
      {
        sets: 1,
        reps: 10,
        weight: 55,
      },
    ],
  },
  {
    sets: [
      {
        sets: 2,
        reps: 8,
        weight: 20,
      },
    ],
  },
];
// Function to flatten the nested sets structure
export const flattenSets = (nestedSets: Set[]): FlatSets => {
  const flatSets: FlatSets = [];

  nestedSets.forEach((set) => {
    // Repeat for the number of sets
    for (let i = 0; i < set.sets; i++) {
      flatSets.push({
        reps: set.reps,
        weight: set.weight,
      });
    }
  });

  return flatSets;
};

export default function WorkoutPlayer({ id }: { id: string }) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalExercisesAtom);
  const setCurrentExerciseIndex = useSetAtom(currentExerciseIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const exerciseFormValues = useAtomValue(exerciseFormValuesAtom);
  const isAllExercisesCompleted = useAtomValue(isAllExercisesCompletedAtom);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  const { data } = useGetAllWorkouts();

  console.log('exercises', exercises);

  console.log(
    'xxxxxxxxxxxxxxxxxxxxxxx',
    exerciseFormValues ? exerciseFormValues : 'no data'
  );



  // Initialize exercise states
  useEffect(() => {
    for (const exercise of exercises) {
      if (!exerciseStates[exercise.id]) {
        const flatSets = flattenSets(exercise.sets);
        setExerciseStates((prev) => ({
          ...prev,
          [exercise.id]: {
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
  }, [isAllExercisesCompleted, exerciseFormValues]);

  useEffect(() => {
    if (data) {
      const workout = data.find((val) => val._id === id);
      if (workout && workout.exercises) {
        // Set the exercises with mock sets data remove this when we have the actual data
        setExercises(
          workout.exercises.map((exercise, index) => ({
            ...exercise,
            sets: mockWorkoutData[index].sets,
          }))
        );
        // setExercises(workout.exercises);
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
                key={exercise.id}
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
            <AlertDialogTitle>Workout Completed</AlertDialogTitle>
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
                // Handle submission logic here
                setIsWorkoutCompleted(false);
                alert('Results submitted');
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
