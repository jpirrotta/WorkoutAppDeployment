import { useQuery } from '@tanstack/react-query';
import { Insights } from '@/types';
import { useUser } from '@clerk/clerk-react';

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
  const { user } = useUser();
  const userId = user?.id ?? '';

  return useQuery({
    queryKey: ['insights', userId],
    queryFn: async ({ signal }) => await fetchUserInsights(userId, signal),
    enabled: true, 
    retry: false,
  });
};

export default useInsights;