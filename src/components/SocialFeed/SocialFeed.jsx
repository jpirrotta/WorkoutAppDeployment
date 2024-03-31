'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import SocialWorkoutCard from '@/components/SocialFeed/SocialWorkoutCard';

export default function SocialFeed() {
  const [workouts, setWorkouts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const handleGetAllPublicWorkouts = async (page, itemsPerPage) => {
    console.log('Get All Public Workouts');
    const response = await fetch(`/api/public-workouts?page=${page}&itemsPerPage=${itemsPerPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setWorkouts(data);
  }

  useEffect(() => {
    handleGetAllPublicWorkouts(1, itemsPerPage);
  }, []);

  const loadMore = () => {
    setItemsPerPage(itemsPerPage + 1);
    handleGetAllPublicWorkouts(1, itemsPerPage);
  };

  return (
    <div className="flex flex-col space-y-8 p-20 items-center justify-center">
      {workouts.map((workout, index) => (
        <SocialWorkoutCard key={index} workout={workout} />
      ))}
      <Button
        className=""
        onClick={loadMore}
      >
        Show More
      </Button>
    </div>
  );
}
  