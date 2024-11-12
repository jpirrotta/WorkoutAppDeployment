'use client';

import React, { useEffect, useState } from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { useExercises } from '@/utils/fetchData';
import { useUser } from '@clerk/clerk-react';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { LoaderCircle, Filter, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExercisesSearchBar from '@/components/ExerciseSearchBar';
import { Exercise } from '@/types';
import { useUserFavourites } from '@/hooks/exercises/getFavourites';
import { useAtom } from 'jotai';
import { selectedExercisesAtom } from '@/store';
import { Badge } from './ui/badge';
import { XCircle } from 'lucide-react';
import { Workout } from '@/types';
import { useWorkoutUpdate } from '@/hooks/workout/useWorkoutMutations';
import { ExerciseFilters } from '@/types';
import { ExerciseFilterBar } from './ExerciseFilterBar';

type ExercisePageProps = {
    title?: string;
    navbarFlag?: boolean;
    workoutFlag?: boolean;
    className?: string;
    workout?: Workout;
};

export default function ExercisePage({ title = 'Our Exercises!', workout, workoutFlag = false, navbarFlag = true, className }: ExercisePageProps) {
    const [searchQuery, setSearchQuery] = useState<string>();
    const [limit, setLimit] = useState(6);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>();
    const [showFav, setShowFav] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const { isSignedIn, isLoaded, user } = useUser();

    const [filters, setFilters] = useState<ExerciseFilters>({
        bodyPart: [],
        target: [],
        equipment: [],
        secondaryMuscles: [],
    });

    let content = <></>;
    const { data: exercises, error, isLoading } = useExercises();
    const { data: favExercises } = useUserFavourites(user?.id);
    const [selectedExercises, setSelectedExercises] = useAtom(selectedExercisesAtom);
    const workoutUpdateMutation = useWorkoutUpdate();

    useEffect(() => {
        if (exercises) {
            let filtered = exercises;

            if (searchQuery) {
                filtered = filtered.filter((exercise: Exercise) =>
                    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (favExercises && favExercises.length > 0 && showFav) {
                filtered = filtered.filter((exercise: Exercise) =>
                    favExercises.includes(exercise.id)
                );
            }

            if (filters.bodyPart && filters.bodyPart.length > 0) {
                filtered = filtered.filter((exercise) =>
                    filters.bodyPart?.includes(exercise.bodyPart)
                );
            }

            if (filters.target && filters.target.length > 0) {
                filtered = filtered.filter((exercise) =>
                    filters.target?.includes(exercise.target)
                );
            }

            if (filters.equipment && filters.equipment.length > 0) {
                filtered = filtered.filter((exercise) =>
                    filters.equipment?.includes(exercise.equipment)
                );
            }

            if (filters.secondaryMuscles && filters.secondaryMuscles.length > 0) {
                filtered = filtered.filter((exercise) =>
                    filters.secondaryMuscles?.some(muscle =>
                        exercise.secondaryMuscles.includes(muscle)
                    )
                );
            }

            setFilteredExercises(filtered.slice(0, limit));
        } else {
            setFilteredExercises(undefined);
        }
    }, [exercises, searchQuery, limit, favExercises, showFav, filters]);

    if (!exercises) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="text-primary text-6xl animate-spin" />
            </div>
        );
    }

    const handleSearch = (query: string | undefined) => {
        if (!query) {
            return setFilteredExercises(undefined);
        }
        setSearchQuery(query);
    };

    const handleShowMore = () => {
        setLimit((prev) => prev + 6);
    };

    const handleShowFav = () => {
        setShowFav((prev) => !prev);
        setSearchQuery(undefined)
    }

    const handleAppendExercises = () => {
        if (!workout) {
            console.error('No Workout provided!');
            return;
        }

        const dataForUpdate = {
            workoutId: workout._id as string,
            workoutData: {
                exerciseArr: selectedExercises,
            },
        };

        workoutUpdateMutation.mutate(dataForUpdate, {
            onSuccess: () => {
                setSelectedExercises([]);
            }
        });
    }

    const handleRemoveExercise = (exeToRemove: Exercise) => {
        setSelectedExercises((prev: Exercise[]) => prev.filter((e: Exercise) => e.id !== exeToRemove.id));
    }

    const handleFilterChange = (newFilters: ExerciseFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            bodyPart: [],
            target: [],
            equipment: [],
            secondaryMuscles: [],
        });
    };

    const SearchAndFilters = () => (
        <div className="px-4">
            <div className="flex items-center gap-1">
                <div className="flex-1">
                    <ExercisesSearchBar onSearch={handleSearch} />
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-10 w-10 flex items-center justify-center"
                    >
                        {showFilters ? (
                            <FilterX className="h-5 w-5 text-primary" />
                        ) : (
                            <Filter className="h-5 w-5" />
                        )}
                    </Button>
                    {Object.values(filters).some(arr => arr && arr.length > 0) && (
                        <XCircle
                            className="h-6 w-6 text-primary cursor-pointer"
                            onClick={handleClearFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const SelectedExerciseList = () => {
        return (
            <div className='flex w-full justify-between pb-2 mt-4 px-4 items-center'>
                <div>
                    <span className="text-md font-medium">
                        {selectedExercises.length > 0 ? (
                            selectedExercises.map((exercise: Exercise) => (
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
                    </span>
                </div>
                <Button onClick={handleAppendExercises}>Add exercise</Button>
            </div>
        )
    }

    if ((exercises && !isSignedIn) || (exercises && !navbarFlag)) {
        content = (
            <div className="bg-background min-h-screen flex flex-col justify-between">
                <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
                    {title}
                </h1>

                <SearchAndFilters />
                <ExerciseFilterBar
                    exercises={exercises}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    showFilters={showFilters}
                />
                {workout && <SelectedExerciseList />}

                <ExerciseCards
                    exercises={filteredExercises ? filteredExercises : exercises}
                    CreateWorkoutFlag={workoutFlag}
                    existingWorkoutFlag={navbarFlag}
                />

                <Button
                    className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
                    variant="link"
                    onClick={handleShowMore}
                >
                    Show More
                </Button>
            </div>
        );
    } else if (exercises && isSignedIn) {
        content = (
            <ContentLayout title="Exercises">
                <div className="bg-background min-h-screen flex flex-col justify-between">
                    <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
                        {title}
                    </h1>

                    <SearchAndFilters />
                    <ExerciseFilterBar
                        exercises={exercises}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        showFilters={showFilters}
                    />
                    <Button
                        className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
                        variant="link"
                        onClick={handleShowFav}
                    >
                        {!showFav ? 'Show Favourites Only' : 'Show All'}
                    </Button>

                    <ExerciseCards
                        exercises={filteredExercises ? filteredExercises : exercises}
                    />
                    <Button
                        className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
                        variant="link"
                        onClick={handleShowMore}
                    >
                        Show More
                    </Button>
                </div>
            </ContentLayout>
        );
    }

    return content;
}