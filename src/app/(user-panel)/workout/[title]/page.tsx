'use client';
import React, { useState } from 'react';
import { WorkoutProgress } from '@/components/workouts/workout-player-progressbar';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { exercises } from '@/data/exercises';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import WorkoutPlayerCommandMenu from '@/components/workouts/player-command-menu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
export default function WorkoutPlayer({
  params,
}: {
  params: { title: string };
}) {
  return (
    <ContentLayout title={decodeURI(params.title) ?? 'Workout'}>
      <div className="flex flex-col items-center justify-between gap-4">
        <WorkoutProgress
          value={60}
          completedSteps={[1, 2]}
          steps={5}
          className="w-[80%] sm:w-[60%]"
        />

        <div className="w-full overflow-hidden px-4">
          {/* Parent container with padding */}
          <Carousel className="w-full">
            <CarouselPrevious />
            <CarouselContent className="flex gap-4">
              {/* Adjust gap between items */}
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
            <CarouselNext />
          </Carousel>
        </div>
        <WorkoutPlayerCommandMenu />
      </div>
    </ContentLayout>
  );
}
