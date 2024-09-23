// src/components/workout/MyWorkout.jsx

import { FC } from 'react';
import ExerciseCards from '../ExerciseCards';
import { Workout } from '@/types';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useWorkoutDelete } from '@/hooks/workout/useWorkoutMutations';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { truncateText } from '@/utils/trucateText';

type MyWorkoutProps = {
    workout: Workout
    setWorkout: (workout: Workout | null) => void
}

const MyWorkout: FC<MyWorkoutProps> = ({ workout, setWorkout }) => {
    const workoutDeleteMutation = useWorkoutDelete();

    const handleDeleteWorkout = () => {
        workoutDeleteMutation.mutate(workout._id);

        setWorkout(null)
    }

    // alert dialog for delete workout confirmation
    const DeleteWorkoutDialog = ({ triggerNode }: { triggerNode: React.ReactNode }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerNode}
            </AlertDialogTrigger>
            <AlertDialogContent className='border-border'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Workout <i><b className='text-md'>&apos; {truncateText(workout.name)} &apos;</b></i>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='flex w-full justify-between'>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteWorkout} >Continue</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    // if workout has exercises, display them or else related message
    return (
        <div className='bg-background gap-10'>
            <div className='flex justify-between sm:px-20 px-5 pt-10'>
                <h1 className='text-2xl font-bold text-primary break-words w-2/5' style={{ hyphens: 'auto' }}>{workout?.name}</h1>
                <DeleteWorkoutDialog triggerNode={<Trash2 className='text-text hover:text-primary hover:cursor-pointer' />} />
            </div>
            {workout?.exercises.length ? (
                <div className='mt-10'>
                    <ExerciseCards exercises={workout.exercises} />
                </div>
            ) : (
                <p className='w-full mt-10 text-center'>
                    There seems to be no exercise in selected workout yet.{' '}
                    <Link className='text-primary' href="/exercises">
                        Try adding some!
                    </Link>
                </p>
            )
            }
        </div>
    )
}

export default MyWorkout;