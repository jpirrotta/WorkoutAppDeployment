'use client';
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

// Hooks
import useAllPublicWorkouts from '@/hooks/workouts/useAllPublicWorkouts';

// UI Components
import { Button } from '@/components/ui/button';
import SocialFeedCard from '@/components/social-feed/SocialFeedCard';

export default function SocialFeed() {
  // Get current user id
  const { user } = useUser();
  const userId = user?.id;

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, perPage] = useState<number>(1);
  const {
    data: workouts,
    isLoading: loadingWorkouts,
    error: errorWorkouts,
  } = useAllPublicWorkouts(page, itemsPerPage);

  if (loadingWorkouts) {
    return <div>Loading...</div>;
  } else if (errorWorkouts) {
    //change to toast
    return <div>Error: {errorWorkouts?.message || errorWorkouts?.message}</div>;
  }

  return (
    <div className="flex flex-col space-y-8 p-20 items-center justify-center">
      {Array.isArray(workouts) &&
        workouts.map((workout) => (
          <SocialFeedCard
            key={workout._id.toString()}
            userId={userId || ''}
            workout={workout}
            perPage={itemsPerPage}
            page={page}
          />
        ))}
      <Button onClick={() => perPage(page + 1)} disabled={loadingWorkouts}>
        Load More
      </Button>
    </div>
  );
}
