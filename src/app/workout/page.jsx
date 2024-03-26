'use client';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/clerk-react';

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

// note that this workoutId is hardcoded for demonstration purposes
// if you delete and create an new workout, the workoutId will not be changed
// to match the new workout _id from the db
const workoutId = '66032d10495c0daf70845b3d';

const testComment = 'Great workout!';

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

  const handleDeleteWorkouts = async () => {
    console.log('Delete Workout');
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
    const response = await fetch('/api/workout/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: workoutId }),
    });
  };

  const handleUnlikeWorkout = async () => {
    console.log('Unlike Workout');
    const response = await fetch('/api/workout/likes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: workoutId }),
    });
  };

  const handleCommentWorkout = async () => {
    console.log('Comment Workout');
    const response = await fetch('/api/workout/comment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        comment: testComment,
        workoutId: workoutId,
      }),
    });
  };

  return (
    <div className="py-10">
      <h1>Workout Page</h1>
      <Button onClick={handleAddWorkout}>add workout</Button>
      <Button onClick={handleDeleteWorkouts}>delete workouts</Button>
      <Button onClick={handleLikeWorkout}>like workout</Button>
      <Button onClick={handleUnlikeWorkout}>unlike workout</Button>
      <Button onClick={handleCommentWorkout}>comment workout</Button>
    </div>
  );
}
