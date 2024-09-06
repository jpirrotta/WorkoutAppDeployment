'use client';

import React from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { ExerciseOptions, fetchData } from '@/utils/fetchData';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import ExercisesSearchBar from '@/components/ExerciseSearchBar';
import { LoaderCircle } from 'lucide-react';

import { useAtom } from 'jotai';
import { limitAtom } from '@/store';

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
}

export default function ExercisePage() {
  const [limit, setLimit] = useAtom(limitAtom);

  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`;
  const fetcher = (url: string) => fetchData(url, ExerciseOptions);

  const { data: exercises, error } = useSWR<Exercise[]>(url, fetcher);

  const loadMore = () => {
    setLimit(limit + 6);
  };

  if (error) return <div>Failed to load exercises</div>;

  if (!exercises)
    return (
      <div className="bg-background min-h-screen p-4 flex items-center justify-center">
        <LoaderCircle className="text-primary text-6xl animate-spin" />
      </div>
    );

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <h1 className="text-primary italic font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
        Our Exercises!
      </h1>

      <ExercisesSearchBar />

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