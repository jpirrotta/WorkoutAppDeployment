import * as React from 'react';
import { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '../ui/badge';
import { XCircle } from 'lucide-react';

import { Exercise, NewWorkout } from '@/types';
import { useWorkoutCreate } from '@/hooks/workout/useWorkoutMutations';
import logger from '@/lib/logger';
import ExercisePage from '../ExercisePage';

import { selectedExercisesAtom } from '@/store';
import { useAtom } from 'jotai';

const CreateWorkout = () => {
    const [workoutName, setWorkoutName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [selectedExercises, setSelectedExercises] = useAtom(selectedExercisesAtom);

    // mutation hooks
    const workoutCreateMutation = useWorkoutCreate();

    // handle clearing form on submission or request
    const handleResetForm = () => {
        setWorkoutName('');
        setIsPublic(false);
        setSelectedExercises([]);
    }

    // handle create workout
    const handleCreateWorkout = async () => {
        // data prep for creating new workout
        const workoutData: NewWorkout = {
            name: workoutName,
            exercises: selectedExercises || [],
            public: isPublic,
            postDate: isPublic ? new Date() : new Date(0), // set post date to current date & time if public, or set it to epoch time (representing empty date) if private
            likes: [],
            comments: [],
            saves: [],
        };

        logger.info('Creating new Workout...');
        logger.info(`New workout data: ${JSON.stringify(workoutData)}`);

        // create workout and reset form on success
        workoutCreateMutation.mutate(workoutData, {
            onSuccess: () => {
                handleResetForm()
            }
        });
    }

    // handle removing selected exercise
    const handleRemoveExercise = (exeToRemove: Exercise) => {
        setSelectedExercises((prev) => prev.filter((e) => e.id !== exeToRemove.id));
    }

    // preview workout component for desktop view only
    const PreviewWorkout = () => {
        return (
            <div className="hidden md:flex flex-col items-center justify-center rounded-lg p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Preview your Workout</h2>
                <div className="p-4 border rounded-md w-full max-w-sm">

                    {/* workout name field */}
                    <p className="text-md font-medium">Workout Name: <span className={`text-primary ${!workoutName && 'italic opacity-50'}`}>{workoutName || 'Your Workout'}</span></p>

                    {/* public or private workout option */}
                    <p className="text-md font-medium mt-2">
                        Visibility: {isPublic ? <span className="text-green-600">Public</span> : <span className="text-red-600">Private</span>}
                    </p>

                    {/* display selected Exercises and related msg if none */}
                    <p className="text-md font-medium">Selected Exercises:
                        {selectedExercises.length > 0 ? (
                            selectedExercises.map((exercise) => (
                                <Badge key={exercise.id} className="bg-primary text-white m-2">
                                    {exercise.name}
                                    <XCircle
                                        className="ml-2 h-4 w-4 cursor-pointer"
                                        onClick={() => handleRemoveExercise(exercise)} />
                                </Badge>
                            ))
                        ) : (
                            <>
                                <br />
                                <span className='text-md text-gray-600 mt-10 italic'>
                                    Selected Exercises will be displayed here.
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto mb-10 px-6">
            {/* Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:p-8 pt-8 shadow-lg rounded-md mb-10">
                {/* Left Section: Form Inputs */}
                <div className="flex flex-col w-full space-y-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-primary">Create New Workout</h1>

                    <div className="flex flex-col space-y-4">
                        {/* Workout Name Input */}
                        <div>
                            <Label htmlFor="workoutName" className="text-lg text-primary">Workout Name</Label>
                            <Input
                                type="text"
                                id="workoutName"
                                className="mt-2 p-3 w-full focus:ring focus:ring-primary"
                                placeholder="Enter Workout Name"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                            />
                        </div>

                        {/* Public/Private Switch with Icon */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="workout-visibility" className="text-lg text-primary">Visibility</Label>
                            <div className="flex items-center">
                                <Switch
                                    id="workout-visibility"
                                    checked={isPublic}
                                    onCheckedChange={() => setIsPublic(!isPublic)}
                                    className="ml-3"
                                />
                            </div>
                        </div>

                        {/* Create Workout Button */}
                        <div className='flex max-md:w-full flex-row gap-8'>
                            <Button
                                className="w-8/12 bg-primary text-white py-3 rounded-md text-lg font-semibold hover:bg-primary-dark focus:outline-none"
                                onClick={handleCreateWorkout}
                                disabled={workoutName.length === 0}
                            >
                                + Create Workout
                            </Button>
                            <Button
                                className="w-4/12 bg-primary text-white py-3 rounded-md text-lg hover:bg-primary-dark focus:outline-none"
                                onClick={handleResetForm}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                <PreviewWorkout />
            </div>

            {/* Exercise listing */}
            <ExercisePage title='Select Exercises for your Workout' navbarFlag={false} />
        </div>
    )
}

export default CreateWorkout;
