// src/components/workout/CreateWorkout.jsx

import * as React from 'react';
import { useState, useEffect, FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import logger from '@/lib/logger';
import { toast } from 'sonner';
import { Exercise, NewWorkout } from '@/types';
import { useGetAllUserWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { useWorkoutCreate, useWorkoutUpdate } from '@/hooks/workout/useWorkoutMutations';

type props = {
    triggerNode: React.ReactNode;
    exerciseToAdd?: Exercise;
    defaultTab?: string;
};

const CreateWorkout: FC<props> = ({ triggerNode, exerciseToAdd, defaultTab = 'create' }) => {
    const [isPublic, setIsPublic] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
    const [workoutName, setWorkoutName] = useState('');

    // mutation hooks
    const workoutCreateMutation = useWorkoutCreate();
    const workoutUpdateMutation = useWorkoutUpdate();

    // get all user workouts
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

    //handle create workout
    const handleCreateWorkout = async () => {
        // TOCONSIDER: if user tries to add exercise while creating new workout, we can add the exercise to the new workout (not sure if this is "not confusing")
        // data prep for creating new workout
        const workoutData: NewWorkout = {
            name: workoutName,
            exercises: [],
            public: isPublic,
            likes: [],
            comments: [],
            saves: [],
        };

        logger.info('Creating new Workout...');
        logger.info(`new workout data: ${JSON.stringify(workoutData)}`);

        workoutCreateMutation.mutate(workoutData);
    }

    //handle add exercise to workout
    const handleAddExercise = async () => {
        logger.info(`Adding Exercise to Workout ${selectedWorkoutId}...`);
        // const response = await fetch(`/api/workout/${selectedWorkoutId}`, {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ userId: userId, exercise: exerciseToAdd })
        // });

        workoutUpdateMutation.mutate({ workoutId: selectedWorkoutId, workoutData: { exercise: exerciseToAdd } });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerNode}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className={`grid w-full mb-5 ${exerciseToAdd ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {/* conditional tab to display when needed from prop flag */}
                            {exerciseToAdd &&
                                <TabsTrigger value="existing">Add to existing</TabsTrigger>
                            }
                            <TabsTrigger value="create" className={`${!exerciseToAdd ? 'w-full' : ''}`}>Create Workout</TabsTrigger>
                        </TabsList>
                        <TabsContent value="existing" className="">
                            <DialogTitle className="mb-2">Add Exercise</DialogTitle>
                            <DialogDescription>
                                Add Exercise to any of existing workouts
                            </DialogDescription>
                            {workoutsLoading ? (
                                <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                                    LOADING...
                                </div>
                            ) : !Array.isArray(workouts) ? (
                                <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                                    No workouts found, try creating one!
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4 mt-2">
                                    <ScrollArea className="h-72 w-full rounded-md border">
                                        <div className="p-4">
                                            {workouts.map((workout) => (
                                                <React.Fragment key={workout._id}>
                                                    <div key={workout._id} className={`text-center hover:cursor-pointer ${selectedWorkoutId === workout._id ?
                                                        'bg-slate-950 rounded-lg' : ''}`} onClick={() => setSelectedWorkoutId(workout._id)}>
                                                        {workout.name}
                                                    </div>
                                                    <Separator className="my-2" />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <Button onClick={handleAddExercise}>Add</Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="create">
                            <DialogTitle>Create a new Workout</DialogTitle>
                            <div className="flex flex-col space-y-4 mt-5">
                                <Label htmlFor="workout-name">Enter Workout Name:</Label>
                                <Input type="text" id="workoutName" placeholder="Workout Name" onChange={(e) => setWorkoutName(e.target.value)} />
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="workout-name">Public:</Label>
                                    <Switch id="airplane-mode" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
                                </div>
                                <Button onClick={handleCreateWorkout} disabled={workoutName.length === 0}>+ Create</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkout;