'use client';
import React from 'react';
import { useUser } from '@clerk/clerk-react';

// Hooks
import useAllPublicWorkouts from '@/hooks/public-workout/useAllPublicWorkouts';

// Components
import SocialFeedCard from '@/components/social-feed/SocialFeedCard';

// State management
import { useSetAtom, useAtomValue } from 'jotai';
import { pageAtom, itemsPerPageAtom } from '@/store';

export default function SocialFeed() {
  // Get current user id
  const { user } = useUser();
  const userId = user?.id;

  // State management
  const page = useAtomValue(pageAtom);
  const itemsPerPage = useAtomValue(itemsPerPageAtom);
  const setPage = useSetAtom(pageAtom);

  const {
    data: workouts,
    isLoading: loadingWorkouts,
    error: errorWorkouts,
  } = useAllPublicWorkouts(page, itemsPerPage);

  const handleLoadPreviousPage = () => {
    console.log('Load previous page');
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleLoadNextPage = () => {
    console.log('Load next page');
    setPage((prev) => prev + 1);
  };

  if (loadingWorkouts) {
    return <div>Loading...</div>;
  } else if (errorWorkouts) {
    //change to toast
    return <div>Error: {errorWorkouts?.message || errorWorkouts?.message}</div>;
  }

  // Sort workouts by postDate
  const sortedWorkouts = Array.isArray(workouts)
    ? workouts.sort((a, b) => {
        const dateA = new Date(a.postDate || 0);
        const dateB = new Date(b.postDate || 0);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  return (
    <div className="flex flex-col space-y-8 p-20 items-center justify-center">
      {sortedWorkouts.map((workout) => (
        <SocialFeedCard
          key={workout._id.toString()}
          userId={userId || ''}
          workout={workout}
          itemsPerPage={itemsPerPage}
          page={page}
        />
      ))}
    </div>
  );
}

/*
<div className="flex flex-row gap-4">
<Button onClick={handleLoadPreviousPage}>
  Back
</Button>
<Button onClick={handleLoadNextPage}>
  Next
</Button>
</div>*/