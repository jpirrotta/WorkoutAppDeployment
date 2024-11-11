import { useQuery } from '@tanstack/react-query';
import { Insights } from '@/types';

const fetchUserInsights = async (
  userId: string,
  signal: AbortSignal
): Promise<Insights> => {
  // no need for try catch, react-query will handle the error and the rest is handled by the api
  const response = await fetch(`/api/insights?userId=${userId}`, { signal });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }
  return response.json();
};

const useInsights = () => {
  const userId = 'user_2n5bNjH87JXQtrRJ76m7Cj6x8c3';
  return useQuery({
    queryKey: ['insights', userId],
    queryFn: async ({ signal }) => await fetchUserInsights(userId, signal),
    enabled: !!userId,
    retry: false,
  });
};

export default useInsights;
