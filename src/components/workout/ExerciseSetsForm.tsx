'use client';

// react imports
import { useState, useEffect } from 'react';

// UI imports
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

// type imports
import { exerciseSetsSchema, Exercise } from '@/types';

// server actions imports
import { useWorkoutExerciseUpdate } from '@/hooks/workout/useWorkoutMutations';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';

// other method imports
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import logger from '@/lib/logger';
import { selectedWorkoutIndexAtom } from '@/store';
import { useAtomValue } from 'jotai';

type ExerciseFormProps = {
    exercise: Exercise;
    setsFlag: boolean;
    setSetsFlag: (value: boolean) => void;
};

export default function ExerciseSetsForm({ exercise, setsFlag, setSetsFlag }: ExerciseFormProps) {
    const selectedWorkoutIndex = useAtomValue(selectedWorkoutIndexAtom);
    const [isSetsEqual, setIsSetsEqual] = useState(true);

    const {
        data: workouts,
        error: workoutError,
        isLoading: workoutsLoading,
    } = useGetAllWorkouts();

    // error handling for getting user workouts
    useEffect(() => {
        if (workoutError) {
            toast.error('Seems like there was an issue getting your Workouts :(', {
                description: workoutError.message,
            });
        }
    }, [workoutError]);

    const exerciseSetsForm = useForm<z.infer<typeof exerciseSetsSchema>>({
        resolver: zodResolver(exerciseSetsSchema),
        defaultValues: {
            sets: exercise.sets.length > 0 ? exercise.sets : [{ sets: 0, reps: 0, weight: 0 }],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: exerciseSetsForm.control,
        name: 'sets',
    });

    // mutation hooks
    const ExerciseUpdateMutation = useWorkoutExerciseUpdate();

    function onSubmit(values: z.infer<typeof exerciseSetsSchema>) {
        console.log('Sets submitting ------> ', values);

        if (!workouts || workoutsLoading) {
            return toast.error('Error getting workouts');
        }

        ExerciseUpdateMutation.mutate({ workoutId: workouts[selectedWorkoutIndex!]._id!, exerciseId: exercise._id?.toString()!, sets: values.sets })
    }

    logger.info(`form errors`, exerciseSetsForm.formState.errors);

    // comparing fields and exercise sets
    const checkSetsEqual = (fields: any, sets: any) => {
        if (fields.length !== sets.length) {
            return false;
        }

        return fields.every((field: any, index: number) => {
            return (
                field.sets === sets[index].sets &&
                field.reps === sets[index].reps &&
                field.weight === sets[index].weight
            );
        });
    };

    // when form values change or db values change check again
    useEffect(() => {
        const subscription = exerciseSetsForm.watch((value, { name, type }) => {
            setIsSetsEqual(checkSetsEqual(value.sets, exercise.sets));
        });
        return () => subscription.unsubscribe();
    }, [exerciseSetsForm, exercise.sets]);

    return (
        <Form {...exerciseSetsForm}>
            <form onSubmit={exerciseSetsForm.handleSubmit(onSubmit)}>
                <div className="h-60 border border-zinc-500 shadow-2xl shadow-primary rounded-md overflow-y-auto mb-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className='flex items-center px-2'>
                            <div className="flex flex-row justify-between mb-1 gap-2 p-3">
                                {/* Sets field */}
                                <FormField
                                    control={exerciseSetsForm.control}
                                    name={`sets.${index}.sets`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sets</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...exerciseSetsForm.register(`sets.${index}.sets`, {
                                                        valueAsNumber: true,
                                                    })}
                                                    type="number"
                                                    placeholder="sets"
                                                    className="w-full"
                                                    min={1}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Reps */}
                                <FormField
                                    control={exerciseSetsForm.control}
                                    name={`sets.${index}.reps`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reps</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...exerciseSetsForm.register(`sets.${index}.reps`, {
                                                        valueAsNumber: true,
                                                    })}
                                                    type="number"
                                                    placeholder="reps"
                                                    className="w-full"
                                                    min={1}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Weight */}
                                <FormField
                                    control={exerciseSetsForm.control}
                                    name={`sets.${index}.weight`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>weight</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...exerciseSetsForm.register(`sets.${index}.weight`, {
                                                        valueAsNumber: true,
                                                    })}
                                                    type="number"
                                                    placeholder="weight"
                                                    className="w-full"
                                                    min={0}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {index > 0 && (
                                <MinusCircle className='text-primary' onClick={() => remove(index)} size={50} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Add new pair of set */}
                <div className="flex w-full justify-center mb-5">
                    <Button
                        type='button'
                        onClick={() => {
                            append({ sets: 0, reps: 0, weight: 0 });
                        }}
                        className='w-full text-xl'
                        variant="outline"
                    >
                        +
                    </Button>
                </div>

                {/* save sets */}
                <div className='flex justify-between'>
                    <Button onClick={() => setSetsFlag(!setsFlag)} variant='outline'>
                        <ChevronLeft />
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSetsEqual}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
}
