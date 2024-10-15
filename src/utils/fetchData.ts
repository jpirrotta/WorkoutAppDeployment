import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { limitAtom } from '../store';
import { Exercise } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const API_HOST = 'https://exercisedb.p.rapidapi.com/exercises';

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_RAPID_API_KEY is not defined');
}

export const ExerciseOptions: RequestInit = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY as string,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

async function fetchExercises(url: string): Promise<Exercise[]>{
  const localStorageKey = 'fetchedData';

  // Check if data is in local storage
  const initialData = localStorage.getItem(localStorageKey);

  if (!initialData) {
    // If nothing is in local storage, fetch the data
    const response = await fetch(url, ExerciseOptions);

    if (response.ok) {
      const data = await response.json() as Promise<Exercise[]>;
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      return data;
      // Save the fetched data to local storage
    } else {
      throw new Error('Network response was not ok.');
    }
  } else {
    // Parse the data from local storage
    return JSON.parse(initialData) as Exercise[];
  }

}

// Custom Hook to fetch and cache the API data (using react-query)
export const useExercises = () => {
  const url = `${API_HOST}?limit=1324`;
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => fetchExercises(url),
  });
};
