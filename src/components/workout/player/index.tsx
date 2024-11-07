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
  completedExerciseAtom,
  carouselApiAtom,
  currentExerciseIndexAtom,
} from '@/store';
import { Exercise } from '@/types';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';

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
        sets: 2,
        reps: 8,
        weight: 55,
      },
      {
        sets: 2,
        reps: 6,
        weight: 60,
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
        sets: 3,
        reps: 10,
        weight: 55,
      },
    ],
  },
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
      {
        sets: 1,
        reps: 6,
        weight: 60,
      },
    ],
  },
];

export default function WorkoutPlayer({ id }: { id: string }) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalExercisesAtom);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const setCurrentExerciseIndex = useSetAtom(currentExerciseIndexAtom);

  const { data } = useGetAllWorkouts();

  console.log('exercises', exercises);

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
  }, [api]);

  return (
    <section
      id="workout-player"
      className="flex flex-col items-center justify-between gap-4"
    >
      <Stopwatch />
      <WorkoutProgress
        value={60}
        steps={totalSteps}
        className="w-[80%] sm:w-[60%]"
      />

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
    </section>
  );
}
