const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_RAPID_API_KEY is not defined');
}

export const ExerciseOptions: RequestInit = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

export const fetchData = async (url: string, options: RequestInit = {}): Promise<any> => {
  const exercisesCache = sessionStorage.getItem(url);
  if (exercisesCache) {
    console.log('CACHE CALLED');
    return JSON.parse(exercisesCache);
  }
  console.log('API CALLED');
  const response = await fetch(url, options);
  const data = await response.json();
  sessionStorage.setItem(url, JSON.stringify(data));
  return data;
};