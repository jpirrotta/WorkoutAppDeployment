import logger from '@/lib/logger.js';
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

const handleDeleteProfile = async (id) => {
  logger.info('Deleting profile data');
  try {
    const res = await fetch(`/api/profile?userId=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    logger.info('Profile data deleted');
  } catch (error) {
    logger.error(error);
  }
};

export default function DeleteProfileData({ userId }) {
  return (
    <div className="flex flex-row justify-between">
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
