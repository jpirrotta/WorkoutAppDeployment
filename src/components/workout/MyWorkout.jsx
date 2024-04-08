// src/components/workout/MyWorkout.jsx

import ExerciseCards from '../ExerciseCards';

export default function MyWorkout({ workout = {} }) {

    if (!Object.keys(workout).length)
        (
            <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                Select a Workout
            </div>
        )

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
                    <ExerciseCards exercises={workout.exercises} skip={true}/>
                </div>
            </div>
        )}
        </div>
    )
}