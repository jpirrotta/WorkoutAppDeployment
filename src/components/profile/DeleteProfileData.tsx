// src/components/Profile/DeleteProfileData.tsx
'use client';

// ui components
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// states
import useUserProfileMutate from '@/hooks/user/useUserProfileMutate';
import { User } from '@/types';


type DeleteProfileDataProps = Readonly<{
  user: User;
}>;

export default function DeleteProfileData({ user }: DeleteProfileDataProps) {
  const mutation = useUserProfileMutate('delete');

  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row pt-4 justify-between">
      <div className="flex flex-col">
        <p className="font-medium">Delete Profile</p>
        <p className="text-sm text-muted-foreground">
          Delete your profile and all its associated data
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete profile</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              profile data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutate(user)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
