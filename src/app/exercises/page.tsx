'use client';

import React, { useState } from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { useExercises } from '@/utils/fetchData';

import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExercisesSearchBar from '@/components/ExerciseSearchBar';

import { useAtom } from 'jotai';
import { limitAtom } from '@/store';

export default function ExercisePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [limit, setLimit] = useAtom(limitAtom);

  const { data: exercises, error, isLoading } = useExercises(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleShowMore = () => {
    console.log('Show more clicked');
    setLimit((prev) => prev + 6);
  };

  if (exercises) {
    console.log(exercises);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="text-primary text-6xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
        Our Exercises!
      </h1>

      <ExercisesSearchBar onSearch={handleSearch} />

      <ExerciseCards exercises={exercises} />
      <Button
        className="px-0 bottom-0 left-0 right-0 flex items-center justify-center"
        variant="link"
        onClick={handleShowMore}
      >
        Show More
      </Button>
    </div>
  );
}