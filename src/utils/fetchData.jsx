const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export const ExerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

export const fetchData = async (url, options = {}) => {
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
