'use client';

import React, { useState } from 'react';
import ExerciseCards from '@/components/ExerciseCards';
import { ExerciseOptions, fetchData } from '@/utils/fetchData';
import useSWR from 'swr';
import Spinner from '@/components/svgs/Spinner.svg';

export default function ExercisePage() {
  const [limit, setLimit] = useState(6);

  let url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`;
  const fetcher = (url) => fetchData(url, ExerciseOptions);

  const { data: exercises, error } = useSWR(url, fetcher);

  const loadMore = () => {
    setLimit(limit + 10);
  };

  if (error) return <div>Failed to load exercises</div>;

  if (!exercises)
    return (
      <div className="bg-slate-900 min-h-screen p-4 flex items-center justify-center">
        <Spinner className="text-primary text-6xl" />
      </div>
    );

  return (
    <div className="bg-slate-900 min-h-screen p-4">
      <h1 className="text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">
        Exercises
      </h1>
      <ExerciseCards exercises={exercises} />
      <button onClick={loadMore} className="mt-4">
        Load More
      </button>
    </div>
  );
}
