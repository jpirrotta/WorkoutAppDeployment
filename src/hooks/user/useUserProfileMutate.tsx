import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { updateUserProfile, deleteUserProfile } from '@/actions/profile';
import { User } from '@/types';
import { toast } from 'sonner';

const useUserProfileMutate = (
  option: 'update' | 'delete'
): UseMutationResult<
  { title: string; message: string },
  unknown,
  User,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: User) => {
      return option === 'delete'
        ? deleteUserProfile(profileData.userId)
        : updateUserProfile(profileData);
    },
    onSuccess: (data, variables) => {
      toast.success(data.title, { description: data.message });
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['insights', variables.userId],
      });
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

export default useUserProfileMutate;
