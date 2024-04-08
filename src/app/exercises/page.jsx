'use client';

import React, { useState } from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { ExerciseOptions, fetchData } from '@/utils/fetchData';
import useSWR from 'swr';
import Spinner from '@/components/svgs/Spinner.svg';
import { Button } from '@/components/ui/Button';
import ExercisesSearchBar from '@/components/ExerciseSearchBar';

import { useAtom } from 'jotai';
import { limitAtom } from '../../../store';

export default function ExercisePage() {
  const [searching, setSearching] = useState(false);
  const [limit, setLimit] = useAtom(limitAtom);
  const [url, setUrl] = useState(
    `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`
  );

  const fetcher = (url) => fetchData(url, ExerciseOptions);

  const { data: exercises, error } = useSWR(url, fetcher);

  const loadMore = () => {
    setLimit(limit + 6);
    setUrl(`https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`);
  };

  const handleSearch = (data) => {
    setSearching((prevState) => {
      if (data) {
        setUrl(`https://exercisedb.p.rapidapi.com/exercises/name/${data}`);
        return true;
      } else {
        setUrl(`https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`);
        return false;
      }
    });
  };

  if (error) return <div>Failed to load exercises</div>;

  if (exercises && exercises.length === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col justify-start items-center pt-4">
        <ExercisesSearchBar onSearch={handleSearch} />
        <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
          No exercises found!
        </h1>
      </div>
    );
  }

  if (!exercises)
    return (
      <div className="bg-background min-h-screen p-4 flex items-center justify-center">
        <Spinner className="text-primary text-6xl" />
      </div>
    );

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
        onClick={loadMore}
      >
        Show More
      </Button>
    </div>
  );
}
