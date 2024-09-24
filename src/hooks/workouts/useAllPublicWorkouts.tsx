import { useQuery } from '@tanstack/react-query';
import { FeedWorkout } from '@/types';

const fetchAllPublicWorkouts = async (
  page: number, 
  itemsPerPage: number,
  signal: AbortSignal
): Promise<FeedWorkout[]> => {
    console.log('Get All Public Workouts');
    const response = await fetch(`/api/public-workouts?page=${page}&itemsPerPage=${itemsPerPage}`, { signal });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch public workouts');
    }
    return await response.json();
}

const useAllPublicWorkouts = (page: number, itemsPerPage: number) => {
  return useQuery({
    queryKey: ['public-workouts', page, itemsPerPage],
    queryFn: async ({ signal }) => await fetchAllPublicWorkouts(page, itemsPerPage, signal)
  });
};

export default useAllPublicWorkouts;