// src/components/Profile/DeleteProfileData.jsx
'use client';
import logger from '@/lib/logger.js';

// ui components
import { Button } from '@/components/ui/Button';
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
} from '@/components/ui/Alert-Dialog';
//

// states
import { useAtom, atom } from 'jotai';
import { profileDataAtom } from '../../../store.js';

const loadingAtom = atom(false);
export default function DeleteProfileData({ userId }) {
  const [, setProfileData] = useAtom(profileDataAtom);
  const [loading, setLoading] = useAtom(loadingAtom); // Add this line

  const handleDeleteProfile = async (id) => {
    setLoading(true); // Set loading to true when the operation starts
    logger.info('Deleting profile data');
    try {
      const res = await fetch(`/api/profile?userId=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      // Clear profile data from the store
      setProfileData(null);
      // refresh the form page
      // window.location.reload();
      //
      logger.info('Profile data deleted');
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false); // Set loading to false when the operation finishes
    }
  };
  // Display a loading spinner when the operation is in progress
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
