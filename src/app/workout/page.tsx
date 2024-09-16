'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
// import Spinner from '@/components/svgs/Spinner.svg';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateWorkout from '@/components/workout/CreateWorkout';
import { addAWorkout } from '@/actions/workout';
import { Separator } from '@/components/ui/separator';
import { ScrollBar } from '@/components/ui/scroll-area';
import MyWorkout from '@/components/workout/MyWorkout';
import { Workout } from '@/types';
import mongoose from 'mongoose';
import logger from '@/lib/logger';

// const workout: Workout = {
//   _id: new mongoose.Types.ObjectId,
//   name: 'Leg Day',
//   public: true,
//   likes: [],
//   comments: [],
//   saves: [],
//   exercises: [
//     {
//       id: '1',
//       bodyPart: 'Legs',
//       equipment: 'Barbell',
//       gifUrl: 'placeholder', //
//       name: 'Squats',
//       target: 'Quadriceps',
//       secondaryMuscles: ['Glutes', 'Hamstrings'],
//       instructions: [
//         'Stand with your feet shoulder-width apart.',
//         'Lower your body until your thighs are parallel to the floor.',
//         'Push back up to the starting position.',
//       ],
//     },
//     {
//       id: '2',
//       bodyPart: 'Legs',
//       equipment: 'Dumbbell',
//       gifUrl: 'placeholder', //
//       name: 'Lunges',
//       target: 'Quadriceps',
//       secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
//       instructions: [
//         'Stand upright, feet together.',
//         'Take a step forward with right leg, lowering your hips until both knees are bent at about a 90-degree angle.',
//         'Push back up to the starting position.',
//       ],
//     },
//     {
//       id: '3',
//       bodyPart: 'Legs',
//       equipment: 'Leg Press Machine',
//       gifUrl: 'placeholder', //
//       name: 'Leg Press',
//       target: 'Quadriceps',
//       secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
//       instructions: [
//         'Sit on the machine with your back and head resting comfortably against the padded support.',
//         'Place your feet hip-width apart on the footplate.',
//         'Push the plate away by extending your knees and hips.',
//         'Return to the starting position without losing the tension in your muscles.',
//       ],
//     },
//   ],
// };

const testWorkoutId = '66032d10495c0daf70845b3d';
const testComment = 'Great workout!';
const testCommentId = '660346da495c0daf70845dea';

export default function Page() {
  // use the useUser hook to get the current user
  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName;

  // const BodyData = {
  //   userId: userId,
  //   name: userName,
  //   workout: workout,
  // };

  // state vars
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currWorkout, setCurrWorkout] = useState<Workout | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // get all workouts on page render
  useEffect(() => {
    if (userId) {
      setLoadingUser(false);
      handleGetWorkouts(userId).then((userWorkouts) => {
        console.log('getting workouts: ', userWorkouts.workouts);
        setWorkouts(userWorkouts.workouts);
      }).catch((error) => {
        logger.error(`Error fetching workouts: ${error.message}`);
      });
    } else {
      logger.warn('User ID is undefined, skipping workout fetch.');
    }
  }, [userId]);

  // get all workouts for a user
  async function handleGetWorkouts(userId: string | undefined): Promise<any> {
    const response = await fetch(`/api/workout?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(`Response: ${JSON.stringify(data)}`);

    return data;
  };

  const handleWorkoutClick = (workout: Workout) => {
    logger.info(`Workout clicked: ${workout.name}`);

    setCurrWorkout(workout);
  }

  // const handleAddWorkout = async () => {
  //   console.log('Add Workout');
  //   const response = await fetch('/api/workout', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(BodyData),
  //   });
  // };

  const handleDeleteWorkouts = async () => {
    console.log('Delete Workout');
    const response = await fetch('/api/workout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  };

  const handleGetAllPublicWorkouts = async (
    page: number,
    itemsPerPage: number
  ) => {
    console.log('Get All Public Workouts');
    const response = await fetch(
      `/api/public-workouts?page=${page}&itemsPerPage=${itemsPerPage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(await response.json());
  };

  //! TODO CONTINUE HERE ONCE THE UI IS READY
  // this handler is responsible for saving a workout from the social feed
  // from different user -> currently logged in user
  const handleSaveWorkout = async () => {
    console.log('Save Workout');
    const response = await fetch('/api/workout/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, workoutId: testWorkoutId }),
    });
  };

  if (loadingUser) {
    return <p>Loading user data...</p>; // Placeholder or spinner
  }

  return (
    <div className="py-5">
      <h1 className='flex justify-center text-primary text-4xl pb-5'>Workout Page</h1>
      <div className='flex gap-4'>
        {/* <Button onClick={handleAddWorkout}>add workout</Button> */}
        <Button onClick={handleDeleteWorkouts}>delete workouts</Button>
        <Button onClick={() => handleGetAllPublicWorkouts(1, 3)}>
          get all public workouts
        </Button>
        <Button onClick={handleSaveWorkout}>save workout</Button>
      </div>

      {/* Create Workout btn */}
      <CreateWorkout
        triggerEle={
          <Button className="m-5">
            + Create Workout
          </Button>}
      />

      {/* Workout List */}
      {
        !Array.isArray(workouts) ? (
          <div className="bg-background min-h-screen p-4 flex items-center justify-center">
            No workouts found, try creating one!
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
                        <Button size='sm' key={workout.id} onClick={() => handleWorkoutClick(workout)}>{workout.name}</Button>
                        <Separator orientation="vertical" decorative />
                      </React.Fragment >
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Separator />

                {/* display selected workout exercises */}
                {currWorkout &&
                  <MyWorkout workout={currWorkout} />
                }
              </section>
            )
          )
      }
    </div>
  );
}
