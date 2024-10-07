'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateWorkout from '@/components/workout/CreateWorkout';
import { Separator } from '@/components/ui/separator';
import { ScrollBar } from '@/components/ui/scroll-area';
import MyWorkout from '@/components/workout/MyWorkout';
import { Workout } from '@/types';
import logger from '@/lib/logger';
import { useGetAllUserWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { toast } from 'sonner';
import { LoaderCircle, BicepsFlexed } from 'lucide-react';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { truncateText } from '@/utils/trucateText';
import { StyledIcon } from '@/components/StyledIcon';

export default function Page() {
  // state vars
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState<number | null>(null);
  const {
    data: workouts,
    error: workoutError,
    isLoading: workoutsLoading,
  } = useGetAllUserWorkouts();

  // error handling for getting user workouts
  useEffect(() => {
    if (workoutError) {
      toast.error('Seems like there was an issue while getting your Workouts:(', {
        description: workoutError.message,
      });
    }
  }, [workoutError]);

  const handleWorkoutClick = (index: number) => {
    if (workouts) {
      logger.info(`Workout clicked: ${workouts[index]?.name}`);
    }

    setSelectedWorkoutIndex(index);
  }

  if (workoutsLoading) {
    return (
      <div className='flex h-screen justify-center items-center'>
        <LoaderCircle className="text-primary text-6xl animate-spin" />
      </div>
    )
  }

  return (
    <ContentLayout title="Workouts" className='sm:px-0'>
      <div className='bg-background min-h-screen max-md:flex max-md:flex-col'>
        <h1 className='flex justify-center text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4'>Explore Your Workouts!</h1>

        {/* Create Workout btn */}
        <CreateWorkout
          triggerNode={
            <Button className="m-5">
              + Create Workout
            </Button>}
        />

        {/* Workout List */}
        {Array.isArray(workouts) && workouts.length > 0 ? (
          //
          // display workouts and selected workout exercises
          <div>
            {/* horizontal Scrollable workout tabs */}
            <ScrollArea className="p-2 mx-2 mb-2 rounded-md border border-border">
              <div className="flex items-center py-2 space-x-4 text-sm">
                {workouts.map((workout, index) => (
                  <div key={workout._id} className='flex justify-center items-center'>
                    <Button size='sm' key={workout._id} className={selectedWorkoutIndex !== null && workouts[selectedWorkoutIndex]._id === workout._id ? 'opacity-50' : ''} onClick={() => handleWorkoutClick(index)}>{truncateText(workout.name)}</Button>
                    <Separator orientation="vertical" decorative className='ml-5 h-5' />
                  </div >
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator />

            {/* display selected workout exercises */}
            {selectedWorkoutIndex !== null ? (
              <MyWorkout
                workout={workouts[selectedWorkoutIndex]}
              />
            ) : (
              <div className="bg-background text-xl min-h-screen p-4 flex items-center justify-center">
                <div className='rounded-full flex flex-col items-center gap-5 p-10'>
                  <StyledIcon Icon={BicepsFlexed} className="size-20 text-primary" />
                  <p className='text-primary'>Select a Workout</p>
                </div>
              </div>
            )}
          </div>
          //
        ) : (
          // 
          <div className="bg-background min-h-screen p-4 flex items-center justify-center">
            No workouts found, try creating one! {/* TODO: maybe hyperlink this text with modal trigger */}
          </div>
          // 
        )}
      </div>
    </ContentLayout>
  );
}
