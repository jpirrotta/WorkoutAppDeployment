import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
//TO DO: import removeCommentPublicWorkout
import { addLikePublicWorkout, removeLikePublicWorkout, addCommentPublicWorkout, addSavePublicWorkout, removeSavePublicWorkout } from '@/actions/publicWorkout';
import { BaseWorkout } from '@/types';
import { toast } from 'sonner';
  
const usePublicWorkoutMutate = (
  option: 'like' | 'unlike' | 'addComment' | 'removeComment' | 'save' | 'unsave'
): UseMutationResult<
  boolean,
  unknown,
  {userId: string, workout: BaseWorkout, commentText?: string, commentId?: string},
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retVal: {userId: string, workout: BaseWorkout, commentText?: string, commentId?: string}) => {
      switch (option) {
        case 'like':
          return addLikePublicWorkout(retVal.userId, retVal.workout._id.toString());
        case 'unlike':
          return removeLikePublicWorkout(retVal.userId, retVal.workout._id.toString());
        case 'addComment':
          if (!retVal.commentText) {
            throw new Error('Comment text is required');
          }
          console.log("Comment: ", retVal.commentText)
          return addCommentPublicWorkout(retVal.userId, retVal.workout._id.toString(), retVal.commentText);
        /*case 'removeComment':
          if (!retVal.commentId) {
            throw new Error('Comment ID is required');
          }
          return removeCommentPublicWorkout(retVal.userId, retVal.workout._id.toString(), retVal.commentId);*/
        case 'save':
          return addSavePublicWorkout(retVal.userId, retVal.workout._id.toString());
        case 'unsave':
          return removeSavePublicWorkout(retVal.userId, retVal.workout._id.toString());  
        default:
          throw new Error('Invalid option');
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.userId],
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

export default usePublicWorkoutMutate;
  