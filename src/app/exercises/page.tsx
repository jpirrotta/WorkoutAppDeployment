'use client';

import React, { useEffect, useState } from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { useExercises } from '@/utils/fetchData';
import { useUser } from '@clerk/clerk-react';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExercisesSearchBar from '@/components/ExerciseSearchBar';
import { Exercise } from '@/types';
import { useUserFavourites } from '@/hooks/exercises/getFavourites';


export default function ExercisePage() {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [limit, setLimit] = useState(6);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>();
  const [showFav, setShowFav] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  let content = <></>;
  const { data: exercises, error, isLoading } = useExercises();

  const { data: favExercises } = useUserFavourites(user?.id);

  useEffect(() => {
    if (exercises) {
      let filtered = exercises;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((exercise: Exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply favorites filter
      if (favExercises && favExercises.length > 0 && showFav) {
        filtered = filtered.filter((exercise: Exercise) =>
          favExercises.includes(exercise.id)
        );
      }

      // Apply limit
      setFilteredExercises(filtered.slice(0, limit));
    } else {
      setFilteredExercises(undefined);
    }
  }, [exercises, searchQuery, limit, favExercises, showFav]);

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
    console.log('Search query:', query);
  };

  const handleShowMore = () => {
    console.log('Show more clicked');
    setLimit((prev) => prev + 6);
  };

  const handleShowFav = () => {
    setShowFav((prev) => !prev);
    setSearchQuery(undefined)
  }

  if (filteredExercises) {
    console.log(filteredExercises);
  }

  if (isLoading || !isLoaded) {
    content = (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="text-primary text-6xl animate-spin" />
      </div>
    );
  }

  if (exercises && !isSignedIn) {
    content = (
      <div className="bg-background min-h-screen flex flex-col justify-between">
        <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
          Our Exercises!
        </h1>

        <ExercisesSearchBar onSearch={handleSearch} />

        <ExerciseCards exercises={filteredExercises ? filteredExercises : exercises} />
        <Button
          className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
          variant="link"
          onClick={handleShowMore}
        >
          Show More
        </Button>
      </div >
    );
  } else if (exercises && isSignedIn) {
    content = (
      <ContentLayout title="Exercises">
        <div className="bg-background min-h-screen flex flex-col justify-between">
          <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
            Our Exercises!
          </h1>

          <ExercisesSearchBar onSearch={handleSearch} />
          <Button
            className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
            variant="link"
            onClick={handleShowFav}
          >
            {!showFav ? 'Show Favourites Only' : 'Show All'}
          </Button>

          <ExerciseCards exercises={filteredExercises ? filteredExercises : exercises} />
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
