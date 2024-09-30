import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
//TO DO: import removeCommentPublicWorkout
import {
  addLikePublicWorkout,
  removeLikePublicWorkout,
  addCommentPublicWorkout,
  addSavePublicWorkout,
  removeSavePublicWorkout,
} from '@/actions/publicWorkout';
import { BaseWorkout } from '@/types';
import { toast } from 'sonner';

const usePublicWorkoutMutate = (
  option: 'like' | 'unlike' | 'comment' | 'uncomment' | 'save' | 'unsave'
): UseMutationResult<
  boolean,
  unknown,
  {
    userId: string;
    workout: BaseWorkout;
    commentText?: string;
    commentId?: string;
    page: number;
    itemsPerPage: number;
  },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retVal: {
      userId: string;
      workout: BaseWorkout;
      commentText?: string;
      commentId?: string;
      page: number;
      itemsPerPage: number;
    }) => {
      if (option === 'like') {
        return addLikePublicWorkout(
          retVal.userId,
          retVal.workout._id.toString()
        );
      } else if (option === 'unlike') {
        return removeLikePublicWorkout(
          retVal.userId,
          retVal.workout._id.toString()
        );
      } else if (option === 'comment') {
        if (!retVal.commentText) {
          throw new Error('Comment text is required');
        }
        console.log('Comment: ', retVal.commentText);
        return addCommentPublicWorkout(
          retVal.userId,
          retVal.workout._id.toString(),
          retVal.commentText
        );
      } /*else if (option === 'uncomment') {
        if (!retVal.commentId) {
          throw new Error('Comment ID is required');
        }
        return removeCommentPublicWorkout(
          retVal.userId,
          retVal.workout._id.toString(),
          retVal.commentId
        );
      }*/ else if (option === 'save') {
        return addSavePublicWorkout(
          retVal.userId,
          retVal.workout._id.toString()
        );
      } else if (option === 'unsave') {
        return removeSavePublicWorkout(
          retVal.userId,
          retVal.workout._id.toString()
        );
      } else {
        throw new Error('Invalid option');
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['public-workouts', variables.page, variables.itemsPerPage],
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
