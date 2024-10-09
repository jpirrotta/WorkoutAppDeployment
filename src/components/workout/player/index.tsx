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
import { useAtom, useAtomValue } from 'jotai';
import { totalStepsAtom, completedStepsAtom, carouselApiAtom } from '@/store';
import { Exercise } from '@/types';
import { useGetAllUserWorkouts } from '@/hooks/workout/useWorkoutQueries';

export default function WorkoutPlayer({ id }: { id: string }) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalStepsAtom);
  const completedSteps = useAtomValue(completedStepsAtom);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const { data } = useGetAllUserWorkouts();

  console.log('exercises', exercises);

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
  }, [api]);

  return (
    <section
      id="workout-player"
      className="flex flex-col items-center justify-between gap-4"
    >
      <Stopwatch />
      <WorkoutProgress
        value={60}
        completedSteps={completedSteps}
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
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <WorkoutPlayerCommandMenu />
    </section>
  );
}
