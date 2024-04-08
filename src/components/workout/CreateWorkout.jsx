// src/components/workout/CreateWorkout.jsx

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/Separator"
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import Spinner from '../svgs/Spinner.svg';
import { useUser } from '@clerk/clerk-react';
import logger from '@/lib/logger';


export default function CreateWorkout({ triggerEle, exercise = {}, defaultTab = 'create' }) {
    //state vars
    const [workouts, setWorkouts] = useState([]);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
    const workout = {
        name: newWorkoutName,
        exercises: []
    }

    // use the useUser hook to get the current user
    const { user } = useUser();
    // critical default values
    const userId = user?.id;
    const userName = user?.fullName;

    const workoutData = {
        userId: userId,
        name: userName,
        workout: workout,
    };

    useEffect(() => {
        handleGetWorkouts().then(userWorkouts => {
            console.log('getting modal workouts: ', userWorkouts.workouts);
            setWorkouts(userWorkouts.workouts);
        });
    }, [userId]);

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

    //handle create workout
    const handleCreateWorkout = async () => {
        console.log('Creating new Workout...');
        console.log(`BodyData: ${workoutData}`);
        try {
            const response = await fetch(`/api/workout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData)
            });
            const data = await response.json();
            console.log(`Response: ${JSON.stringify(data)}`);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return new Response(JSON.stringify('Error creating workout.', { status: 500 }));
        };
    }

    //handle add exercise to workout
    const handleAddExercise = async () => {
        console.log(`Adding Exercise to Workout ${selectedWorkoutId}...`);
        const response = await fetch(`/api/workout/${selectedWorkoutId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, exercise: exercise })
        });
        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data)}`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerEle}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-5">
                            {exercise &&
                                <TabsTrigger value="existing">Add to existing</TabsTrigger>
                            }
                            <TabsTrigger value="create">Create Workout</TabsTrigger>
                        </TabsList>
                        {exercise &&
                            <TabsContent value="existing" className="">
                                <DialogTitle className="mb-2">Add Exercise</DialogTitle>
                                <DialogDescription>
                                    Add Exercise to any of existing workouts
                                </DialogDescription>
                                {!Array.isArray(workouts) ? (
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
                                            <div className="flex flex-col space-y-4 mt-2">
                                                <ScrollArea className="h-72 w-full rounded-md border">
                                                    <div className="p-4">
                                                        {workouts.map((workout) => (
                                                            <React.Fragment key={workout._id}>
                                                                <div key={workout._id} className={`text-center hover:cursor-pointer ${selectedWorkoutId === workout._id ? 'bg-slate-950 rounded-lg' : ''}`} onClick={() => setSelectedWorkoutId(workout._id)}>
                                                                    {workout.name}
                                                                </div>
                                                                <Separator className="my-2" />
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                                <Button onClick={handleAddExercise}>Add</Button>
                                            </div>
                                        )
                                )
                                }
                            </TabsContent>
                        }
                        <TabsContent value="create">
                            <DialogTitle>Create a new Workout</DialogTitle>
                            <div className="flex flex-col space-y-4 mt-5">
                                <Label htmlFor="workout-name">Enter Workout Name:</Label>
                                <Input type="text" id="workout-name" placeholder="Workout Name" onChange={setNewWorkoutName} />
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="workout-name">Public:</Label>
                                    <Switch id="airplane-mode" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
                                </div>
                                <Button onClick={handleCreateWorkout} disabled>+ Create</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}