import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/actions/profile';
import { useUser } from '@clerk/clerk-react';

const useUserData = () => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async ()  => {
      return await getUserData(userId)
    },
    enabled: !!userId,
  });
};

export default useUserData;
