// src/components/workout/MyWorkout.jsx

import { FC } from 'react';
import ExerciseCards from '../ExerciseCards';
import { Workout } from '@/types';
import Link from 'next/link';

type MyWorkoutProps = {
    workout: Workout | null
}

const MyWorkout: FC<MyWorkoutProps> = ({ workout }) => {
    // if no workout is selected return a message
    if (!workout?.exercises.length) {
        return (
            <div className="bg-background h-screen p-4 text-center pt-20">
                There seems to be no exercise in selected workout yet.{' '}
                <Link className='text-primary' href="/exercises">
                    Try adding some!
                </Link>
            </div>
        )
    }

    // if workout has exercises, display them
    return (
        <div className='bg-background'>
            <h1 className='text-2xl font-bold ml-20 pt-10 text-primary'>{workout?.name}</h1>
            <div className="my-10">
                <ExerciseCards exercises={workout.exercises} />
            </div>
        </div>
    )
}

export default MyWorkout;