// OLD WILL DELETE AFTER TESTING

// const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

// if (!API_KEY) {
//   throw new Error('NEXT_PUBLIC_RAPID_API_KEY is not defined');
// }

// export const ExerciseOptions: RequestInit = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': API_KEY,
//     'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
//   },
// };

// export const fetchData = async (url: string, options: RequestInit = {}): Promise<any> => {
//   const exercisesCache = sessionStorage.getItem(url);
//   if (exercisesCache) {
//     console.log('CACHE CALLED');
//     return JSON.parse(exercisesCache);
//   }
//   console.log('API CALLED');
//   const response = await fetch(url, options);
//   const data = await response.json();
//   sessionStorage.setItem(url, JSON.stringify(data));
//   return data;
// };


// NEW

import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { limitAtom } from '../store';

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

// Use Fetch to get the data from the API
export const fetchExercises = async (url: string = API_HOST): Promise<any> => {
  const response = await fetch(url, ExerciseOptions);
  return response.json();
};

// Custom Hook to fetch and cache the API data (using react-query)
export const useExercises = (searchParam: string = '') => {
  const [limit] = useAtom(limitAtom);
  const url = searchParam
    ? `${API_HOST}/name/${searchParam}`
    : `${API_HOST}?limit=${limit}`;
  return useQuery({
    queryKey: ['exercises', url],
    queryFn: () => fetchExercises(url),
  });
};