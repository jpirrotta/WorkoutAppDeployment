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

const workoutId = '660252f6978de2a29d3ac103';

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

  const handleAddWorkout = () => {
    console.log('Add Workout');
    const response = fetch('/api/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(BodyData),
    });
  };

  const handleDeleteWorkouts = () => {
    console.log('Delete Workout');
    const response = fetch('/api/workout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });
  };

  const handleLikeWorkout = () => {
    console.log('Like Workout');
    const response = fetch('/api/workout/like', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, workoutId: workoutId }),
    });
  };

  const handleCommentWorkout = () => {
    console.log('Comment Workout');
    const response = fetch('/api/workout/comment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });
  };

  return (
    <div className="py-10">
      <h1>Workout Page</h1>
      <Button onClick={handleAddWorkout}>add workout</Button>
      <Button onClick={handleDeleteWorkouts}>delete workouts</Button>
      <Button onClick={handleLikeWorkout}>like workout</Button>
      <Button onClick={handleCommentWorkout}>comment workout</Button>
    </div>
  );
}
