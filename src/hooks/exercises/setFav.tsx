import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';
import { updateUserProfile, deleteUserProfile } from '@/actions/profile';
import { User } from '@/types';
import { toast } from 'sonner';
import { addFavoriteExercise, removeFavoriteExercise } from '@/actions/favExercises';

const useFavMutate = (
): UseMutationResult<
    { title: string; message: string },
    unknown,
    { userId: string; exerciseId: string, option: 'add' | 'remove' },
    unknown
> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { userId: string; exerciseId: string, option: 'add' | 'remove' },

        ) => {
            return data.option === 'remove'
                ? removeFavoriteExercise(data.userId, data.exerciseId)
                : addFavoriteExercise(data.userId, data.exerciseId);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['favourites', variables.userId],
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

export default useFavMutate;
