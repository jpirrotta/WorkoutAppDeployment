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
    if (workout === null) {
        return (
            <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                There seems to be no exercise in this workout yet.
                {/* hyperlink this text */}
                <Link href="/exercises">
                    Try adding some!
                </Link>
            </div>
        )
    }

    // if workout has exercises, display them
    return (
        <div>
            {!Object.keys(workout).length ? (
                <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                    Select a Workout
                </div>
            ) : (
                <div>
                    <h1 className='text-2xl font-bold ml-20 mt-10 text-primary'>{workout.name}</h1>
                    <div className="my-10">
                        <ExerciseCards exercises={workout.exercises} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyWorkout;