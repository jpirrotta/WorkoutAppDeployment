import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/actions/profile';
import { useUser } from '@clerk/clerk-react';

const useUserProfile = () => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => await getUserData(userId),
    enabled: !!userId,
    retry: false,
  });
};

export default useUserProfile;
