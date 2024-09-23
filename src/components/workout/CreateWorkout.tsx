// src/components/workout/CreateWorkout.jsx

import * as React from 'react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import logger from '@/lib/logger';
import { NewWorkout } from '@/types';
import { useWorkoutCreate } from '@/hooks/workout/useWorkoutMutations';

const CreateWorkout = ({ triggerNode }: { triggerNode: React.ReactNode }) => {
    const [isPublic, setIsPublic] = useState(false);
    const [workoutName, setWorkoutName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // mutation hooks
    const workoutCreateMutation = useWorkoutCreate();

    //handle create workout
    const handleCreateWorkout = async () => {
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

        // close on request to workout creation
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerNode}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Workout</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-5">
                    <Label htmlFor="workout-name">Enter Workout Name:</Label>
                    <Input type="text" id="workoutName" placeholder="Workout Name" onChange={(e) => setWorkoutName(e.target.value)} />
                    <div className="flex items-center justify-between">
                        <Label htmlFor="workout-name">Public:</Label>
                        <Switch id="airplane-mode" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
                    </div>
                    <DialogFooter className='p-2'>
                        <Button className='w-full' onClick={handleCreateWorkout} disabled={workoutName.length === 0}>+ Create</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default CreateWorkout;