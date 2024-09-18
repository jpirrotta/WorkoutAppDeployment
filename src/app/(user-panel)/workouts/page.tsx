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

export default function Page() {
  // state vars
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
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

  const handleWorkoutClick = (workout: Workout) => {
    logger.info(`Workout clicked: ${workout.name}`);

    setSelectedWorkout(workout);
  }

  // const handleDeleteWorkouts = async () => {
  //   console.log('Delete Workout');
  //   const response = await fetch('/api/workout', {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId }),
  //   });
  // };

  // // this handler is responsible for saving a workout from the social feed
  // // from different user -> currently logged in user
  // const handleSaveWorkout = async () => {
  //   console.log('Save Workout');
  //   const response = await fetch('/api/workout/save', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId, workoutId: testWorkoutId }),
  //   });
  // };

  if (workoutsLoading) {
    return (
      <div className='flex justify-center items-center'>
        <p>Loading user Workouts...</p>
      </div>
    )
  }

  return (
    <div className="py-5">
      <h1 className='flex justify-center text-primary text-4xl pb-5'>Workout Page</h1>
      {/* <div className='flex gap-4'>
        <Button onClick={handleDeleteWorkouts}>delete workouts</Button>
        <Button onClick={handleSaveWorkout}>save workout</Button>
      </div> */}

      {/* Create Workout btn */}
      <CreateWorkout
        triggerNode={
          <Button className="m-5">
            + Create Workout
          </Button>}
      />

      {/* Workout List */}
      {
        !Array.isArray(workouts) ? (
          <div className="bg-background min-h-screen p-4 flex items-center justify-center">
            No workouts found, try creating one! {/* TODO: maybe hyperlink this text with modal trigger */}
          </div>
        ) :
          (workouts.length === 0 ? (
            <div className="bg-background min-h-screen p-4 flex items-center justify-center">
              {/* <Spinner className="text-primary text-6xl" /> */}
              <p>
                Loading...
              </p>
            </div>
          ) :
            (
              // Listing workouts
              <section>
                {/* Scrollable workout tabs */}
                <ScrollArea className="w-full h-full p-2 mx-2 mb-2 rounded-md border border-border">
                  <div className="flex items-center space-x-4 text-sm">
                    {workouts.map((workout) => (
                      <React.Fragment key={workout._id}>
                        <Button size='sm' key={workout._id} onClick={() => handleWorkoutClick(workout)}>{workout.name}</Button>
                        <Separator orientation="vertical" decorative />
                      </React.Fragment >
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Separator />

                {/* display selected workout exercises */}
                {selectedWorkout &&
                  <MyWorkout workout={selectedWorkout} />
                }
              </section>
            )
          )
      }
    </div>
  );
}
