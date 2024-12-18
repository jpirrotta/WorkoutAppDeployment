import { useState, useEffect, FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { MultiSelect } from '../ui/multi-select';
import { toast } from 'sonner';
import { Exercise, NewWorkout } from '@/types';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { useWorkoutCreate, useWorkoutUpdate } from '@/hooks/workout/useWorkoutMutations';
import { truncateText } from '@/utils/trucateText';

type props = {
    triggerNode: React.ReactNode;
    exerciseToAdd: Exercise;
};

const AddExerciseToWorkout: FC<props> = ({ triggerNode, exerciseToAdd }) => {
    const [selectedWorkoutIds, setSelectedWorkoutIds] = useState([] as string[]);
    const [workoutSearchValue, setWorkoutSearchValue] = useState('');
    const [isAddExeOpen, setIsAddExeOpen] = useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [options, setOptions] = useState<{ label: string, value: string }[]>([]);

    const {
        data: workoutData,
        error: workoutError,
    } = useGetAllWorkouts();

    useEffect(() => {
        // structure workout data for MultiSelect
        if (workoutData) {
            console.log(`getting workouts....`)

            const structuredOptions = workoutData.map(workout => ({
                label: truncateText(workout.name),
                value: workout._id!
            }));

            setOptions(structuredOptions);
        }
    }, [workoutData])

    // Mutation hooks
    const workoutCreateMutation = useWorkoutCreate();
    const workoutUpdateMutation = useWorkoutUpdate();

    // Error handling
    useEffect(() => {
        if (workoutError) {
            toast.error('Error getting workouts: ', { description: workoutError.message });
        }
    }, [workoutError]);


    // handle create new workout while adding selected exercise to it
    const handleCreateWorkout = async () => {
        const trimmedValue = workoutSearchValue.trim();
        if (!trimmedValue) {
            toast.error('Workout name cannot be empty');
            return;
        }

        // Prepare data for creating new workout
        const newWorkoutData: NewWorkout = {
            name: trimmedValue,
            exercises: [],
            public: false,
            likes: [],
            comments: [],
            saves: [],
        };

        console.log(`Creating new Workout: ${JSON.stringify(newWorkoutData)}`);
        const response = await workoutCreateMutation.mutateAsync(newWorkoutData);

        if (response?.createdWorkout?._id) {
            // Add the newly created workout to the options
            selectedWorkoutIds.push(response.createdWorkout._id);
        }
        else {
            console.log(`didn\'t got any workout in create workout response: ${JSON.stringify(response)}`);
        }

        // clear the search field
        setWorkoutSearchValue('');

        // close the confirmation dialog
        setIsAlertDialogOpen(false);
    };


    // handle adding exercise to selected workouts
    const handleAddExercise = async () => {
        console.log(`Adding Exercise to Workouts: ${workoutUpdateMutation.isPending}`);

        await Promise.all(
            selectedWorkoutIds.map(workoutId =>
                workoutUpdateMutation.mutateAsync({ workoutId, workoutData: { exerciseArr: [exerciseToAdd] } })
            )
        );

        toast.success("Workouts Updated", { description: "Exercise added to all selected workouts successfully!" });

        setIsAddExeOpen(false);
    };

    const openCreateWorkoutDialog = () => {
        setIsAlertDialogOpen(true);
    }

    // handle create workout dialog and add exercise to it
    const CreateWorkoutDialog = ({ triggerHolder }: { triggerHolder: React.ReactNode }) => (
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogTrigger asChild>
                {triggerHolder}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Workout</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will create new Workout named <i><b><q>{workoutSearchValue}</q></b></i> and add exercise to it that you currently selected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='flex w-full justify-between'>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCreateWorkout}>Continue</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <Dialog open={isAddExeOpen} onOpenChange={setIsAddExeOpen}>
            <DialogTrigger
                asChild
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {triggerNode}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Exercise to any Workout</DialogTitle>
                </DialogHeader>
                <MultiSelect
                    className='border border-border flex ml-30 justify-center items-center rounded-md'
                    options={options}
                    defaultValue={selectedWorkoutIds}
                    onValueChange={(inputValue) => {
                        console.log(`selected workout ID's: ${inputValue}`);
                        setSelectedWorkoutIds(inputValue)
                    }}
                    // searchValue={workoutSearchValue}
                    placeholder="Select workouts or type to create one"
                    variant="inverted"
                    inputPlaceholder='Search Workouts...'
                    maxCount={4}
                    onSearchValChange={(val) => setWorkoutSearchValue(val.trim())}
                    NoResultPlaceholder={
                        <CreateWorkoutDialog
                            triggerHolder={
                                <>
                                    <p className='px-5'>
                                        No Workout named <q>{workoutSearchValue}</q> exist
                                    </p>
                                    <p className='text-primary underline cursor-pointer' onClick={openCreateWorkoutDialog}>create one?
                                    </p>
                                </>
                            } />
                    }
                />
                <DialogFooter className='p-2'>
                    <Button
                        className='w-full'
                        onClick={(e) => { e.currentTarget.disabled = true; handleAddExercise() }}
                        disabled={(selectedWorkoutIds.length === 0) || (workoutUpdateMutation.isPending)}
                    >
                        Add Exercise
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddExerciseToWorkout;
