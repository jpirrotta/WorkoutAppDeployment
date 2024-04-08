'use client';
import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/Separator';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Spinner from '@/components/svgs/Spinner.svg';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import MyWorkout from '@/components/workout/MyWorkout';
import CreateWorkout from '../../components/workout/CreateWorkout';

const workout = {
  name: 'Leg Day',
  exercises: [
    {
      id: '1',
      bodyPart: 'Legs',
      equipment: 'Barbell',
      name: 'Squats',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings'],
      instructions: [
        'Stand with your feet shoulder-width apart.',
        'Lower your body until your thighs are parallel to the floor.',
        'Push back up to the starting position.',
      ],
    },
    {
      id: '2',
      bodyPart: 'Legs',
      equipment: 'Dumbbell',
      name: 'Lunges',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
      instructions: [
        'Stand upright, feet together.',
        'Take a step forward with right leg, lowering your hips until both knees are bent at about a 90-degree angle.',
        'Push back up to the starting position.',
      ],
    },
    {
      id: '3',
      bodyPart: 'Legs',
      equipment: 'Leg Press Machine',
      name: 'Leg Press',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
      instructions: [
        'Sit on the machine with your back and head resting comfortably against the padded support.',
        'Place your feet hip-width apart on the footplate.',
        'Push the plate away by extending your knees and hips.',
        'Return to the starting position without losing the tension in your muscles.',
      ],
    },
  ],
};

const updateWorkout = {
  name: 'Leg Day',
  exercises: [
    {
      id: '1',
      bodyPart: 'Legs',
      equipment: 'Barbell',
      name: 'Squats',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings'],
      instructions: [
        'Stand with your feet shoulder-width apart.',
        'Lower your body until your thighs are parallel to the floor.',
        'Push back up to the starting position.',
      ],
    },
    {
      id: '2',
      bodyPart: 'Legs',
      equipment: 'Dumbbell',
      name: 'Lunges',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
      instructions: [
        'Stand upright, feet together.',
        'Take a step forward with right leg, lowering your hips until both knees are bent at about a 90-degree angle.',
        'Push back up to the starting position.',
      ],
    },
    {
      id: '3',
      bodyPart: 'Legs',
      equipment: 'Leg Press Machine',
      name: 'Leg Press',
      target: 'Quadriceps',
      secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
      instructions: [
        'Sit on the machine with your back and head resting comfortably against the padded support.',
        'Place your feet hip-width apart on the footplate.',
        'Push the plate away by extending your knees and hips.',
        'Return to the starting position without losing the tension in your muscles.',
      ],
    },
  ],
};

const newExercise = {
  bodyPart: 'Legs',
  equipment: 'Barbell',
  name: 'some new exercise',
  target: 'Quadriceps',
  secondaryMuscles: ['Glutes', 'Hamstrings'],
  instructions: [
    'Stand with your feet shoulder-width apart.',
    'Lower your body until your thighs are parallel to the floor.',
    'Push back up to the starting position.',
  ],
}


// note that this workoutId is hardcoded for demonstration purposes
// if you delete and create an new workout, the workoutId will not be changed
// to match the new workout _id from the db
const testWorkoutId = '66032d10495c0daf70845b3d';
const testComment = 'Great workout!';
const testCommentId = '660346da495c0daf70845dea';

export default function Page() {
  // use the useUser hook to get the current user
  const { user } = useUser();
  // critical default values
  const userId = user?.id;
  const userName = user?.fullName;
  const BodyData = {
    userId: userId,
    name: userName,
    workout: workout,
  };

  // state vars
  const [workouts, setWorkouts] = useState([]);
  const [currWorkout, setCurrWorkout] = useState({});

  // get all workouts for the current user
  const handleGetWorkouts = async () => {
    console.log('Get Workouts');
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

  //handling the workout click event
  //TODO: make sure to remove if not needed later
  const handleWorkoutClick = (workout) => {
    console.log('Workout selected: ', workout.name);

    setCurrWorkout(workout);
  };

  useEffect(() => {
    handleGetWorkouts().then(userWorkouts => {
      console.log('getting workouts: ', userWorkouts.workouts);
      setWorkouts(userWorkouts.workouts);
      console.log('Workouts type: ', typeof workouts);
    });
  }, [userId]);

  // adding specific workout for curr user
  const handleAddWorkout = async () => {
    console.log('Add Workout');
    const response = await fetch('/api/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(BodyData),
    });
  };

  // get a specific workout for the current user
  const handleGetWorkout = async () => {
    console.log('Get a Workout');
    const response = await fetch(`/api/workout/660cc544220c6d7237ede9ff?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(await response.json());
  };

  // delete a specific workout for the current user
  const handleDeleteWorkout = async () => {
    console.log('Delete a Workout');

    const response = await fetch('/api/workout/660cc544220c6d7237ede9ff', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });

    console.log(await response.json());
  }

  // delete a specific workout for the current user
  const handleUpdateWorkout = async () => {
    console.log('Update a Workout');

    const response = await fetch('/api/workout/6612d3182f6e77adbab39697', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, updateWorkout: updateWorkout }),
    });

    console.log(await response.json());
  }

  // add exercise to a specific workout for the current user
  const handleAddExercise = async () => {
    console.log('Add Exercise to Workout');

    const response = await fetch('/api/workout/6612d3182f6e77adbab39697', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, exercise: newExercise }),
    });

    console.log(await response.json());
  }

  const handleDeleteWorkouts = async () => {
    console.log('Delete Workouts');
    const response = await fetch('/api/workout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });
  };

  const handleLikeWorkout = async () => {
    console.log('Like Workout');
    const response = await fetch('/api/workout/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: testWorkoutId }),
    });
  };

  const handleUnlikeWorkout = async () => {
    console.log('Unlike Workout');
    const response = await fetch('/api/workout/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: testWorkoutId }),
    });
  };

  const handleCommentWorkout = async () => {
    console.log('Comment Workout');
    const response = await fetch('/api/workout/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        comment: testComment,
        workoutId: testWorkoutId,
      }),
    });
  };

  const handleDeleteComment = async () => {
    console.log('Delete Comment');
    const response = await fetch('/api/workout/comment', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        commentId: testCommentId,
        workoutId: testWorkoutId,
      }),
    });
  };

  const handlePublishWorkout = async () => {
    console.log('Publish Workout');
    const response = await fetch('/api/workout/public', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: testWorkoutId, isPublic: true }),
    });
  };

  const handleUnpublishWorkout = async () => {
    console.log('Unpublish Workout');
    const response = await fetch('/api/workout/public', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: testWorkoutId, isPublic: false }),
    });
  };

  // return the most recent public workouts first
  const handleGetAllPublicWorkouts = async (page, itemsPerPage) => {
    console.log('Get All Public Workouts');
    const response = await fetch(`/api/public-workouts?page=${page}&itemsPerPage=${itemsPerPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(await response.json());
  }
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
      body: JSON.stringify({ userId: userId, workoutId: testWorkoutId }),
    });
  };

  return (
    <main className='min-h-screen' >
      <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
        My Go-To Workouts
      </h1>

      {/* Test btns */}
      <div className="py-10 space-x-2 space-y-2" >
        <Button onClick={handleAddWorkout}>add workout</Button>
        <Button onClick={handleGetWorkouts}>get all My workouts</Button>
        <Button onClick={handleGetWorkout}>get a workout</Button>
        <Button onClick={handleUpdateWorkout}>Update a workout</Button>
        <Button onClick={handleAddExercise}>Add new Exercise to a workout</Button>
        <Button onClick={handleDeleteWorkout}>Delete a workout</Button>
        <Button onClick={handleDeleteWorkouts}>delete workouts</Button>
        <Button onClick={handleLikeWorkout}>like workout</Button>
        <Button onClick={handleUnlikeWorkout}>unlike workout</Button>
        <Button onClick={handleCommentWorkout}>comment workout</Button>
        <Button onClick={handleDeleteComment}>delete comment</Button>
        <Button onClick={handlePublishWorkout}>publish workout</Button>
        <Button onClick={handleUnpublishWorkout}>unpublish workout</Button>
        <Button onClick={() => handleGetAllPublicWorkouts(1, 3)}>get all public workouts</Button>
        <Button onClick={handleSaveWorkout}>save workout</Button>
      </div >

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
        ) : (
          Array.isArray(workouts) && workouts.length === 0 ? (
            <div className="bg-background min-h-screen p-4 flex items-center justify-center">
              <Spinner className="text-primary text-6xl" />
            </div>
          ) :
            (
              // page content
              <section>
                {/* Scrollable workout tabs */}
                <ScrollArea className="w-full h-full p-2 mx-2 mb-2 rounded-md border border-border">
                  <div className="flex items-center space-x-4 text-sm">
                    {Array.isArray(workouts) && workouts.map((workout) => (
                      <React.Fragment key={workout._id}>
                        <Button size='sm' key={workout.id} onClick={() => handleWorkoutClick(workout)}>{workout.name}</Button>
                        <Separator orientation="vertical" decorative />
                      </React.Fragment>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Separator />


                {/* selected workout exercises */}
                <MyWorkout workout={currWorkout} />
              </section>
            )
        )
      }
    </main >
  );
}
