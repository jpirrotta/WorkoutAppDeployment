'use client';
import { useEffect } from 'react';
import { WorkoutProgress } from '@/components/workouts/workout-player-progressbar';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { exercises } from '@/data/exercises';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import WorkoutPlayerCommandMenu from '@/components/workouts/player-command-menu';
import Stopwatch from '@/components/workouts/stopwatch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useAtom, useAtomValue } from 'jotai';
import { totalStepsAtom, completedStepsAtom, carouselApiAtom } from '@/store';
export default function WorkoutPlayer({
  params,
}: {
  params: { title: string };
}) {
  const [api, setApi] = useAtom(carouselApiAtom);
  const [totalSteps, setTotalSteps] = useAtom(totalStepsAtom);
  const completedSteps = useAtomValue(completedStepsAtom);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('init', () => {
      console.log('Carousel initialized');
      setTotalSteps(exercises.length);
    });
  }, [api, setTotalSteps]);

  return (
    <ContentLayout title={decodeURI(params.title) ?? 'Workout'}>
      <div className="flex flex-col items-center justify-between gap-4">
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
      </div>
    </ContentLayout>
  );
}
