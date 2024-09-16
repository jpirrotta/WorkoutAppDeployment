import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { User } from '@/types';

const fetchUserProfile = async (
  userId: string,
  signal: AbortSignal
): Promise<User> => {
  // no need for try catch, react-query will handle the error and the rest is handled by the api
  const response = await fetch(`/api/profile?userId=${userId}`, { signal });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }
  return response.json();
};

const useUserProfile = () => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async ({ signal }) => await fetchUserProfile(userId, signal),
    enabled: !!userId,
    retry: false,
  });
};

export default useUserProfile;
