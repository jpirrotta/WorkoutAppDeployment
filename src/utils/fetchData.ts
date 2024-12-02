import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { limitAtom } from '../store';
import logger from '@/lib/logger';
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

async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && Boolean(contentType?.startsWith('image/'));
  } catch {
    return false;
  }
}

async function fetchExercises(url: string): Promise<Exercise[]> {
  const localStorageKey = 'fetchedData';

  async function fetchAndValidate(): Promise<Exercise[]> {
    logger.info(`FETCHING exercises from ${url}`);
    const response = await fetch(url, ExerciseOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json() as Exercise[];
    
    // Validate first gif URL
    if (data.length > 0 && !(await isValidImageUrl(data[0].gifUrl))) {
      logger.warn('Invalid GIF URL detected, clearing cache');
      localStorage.removeItem(localStorageKey);
      throw new Error('Invalid GIF URLs detected');
    }

    localStorage.setItem(localStorageKey, JSON.stringify(data));
    return data;
  }

  // Check if data is in local storage
  const initialData = localStorage.getItem(localStorageKey);

  if (!initialData) {
    return fetchAndValidate();
  }

  // Validate cached data
  const parsedData = JSON.parse(initialData) as Exercise[];
  if (parsedData.length > 0 && !(await isValidImageUrl(parsedData[0].gifUrl))) {
    logger.warn('Cached GIF URL invalid, refetching');
    localStorage.removeItem(localStorageKey);
    return fetchAndValidate();
  }

  return parsedData;
}

// Custom Hook to fetch and cache the API data (using react-query)
export const useExercises = () => {
  const url = `${API_HOST}?limit=1324`;
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => fetchExercises(url),
  });
};