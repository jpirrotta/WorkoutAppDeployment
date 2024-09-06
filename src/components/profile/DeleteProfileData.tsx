// src/components/Profile/DeleteProfileData.tsx
'use client';
import logger from '@/lib/logger.js';

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
import { useAtom, atom } from 'jotai';
import { profileDataAtom } from '@/store';

// TODO Look at this crap
const loadingAtom = atom(false);

type DeleteProfileDataProps = Readonly<{
  userId: string;
  resetForm: () => void;
}>;

export default function DeleteProfileData({
  userId,
  resetForm,
}: DeleteProfileDataProps) {
  const [, setProfileData] = useAtom(profileDataAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const handleDeleteProfile = async (id: string) => {
    setLoading(true);
    logger.info('Deleting profile data');
    try {
      const res = await fetch(`/api/profile?userId=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      setProfileData(undefined);
      resetForm();
      logger.info('Profile data deleted');
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            <AlertDialogAction onClick={() => handleDeleteProfile(userId)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
