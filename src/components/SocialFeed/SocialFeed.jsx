'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import SocialWorkoutCard from '@/components/SocialFeed/SocialWorkoutCard';
import { useUser } from '@clerk/clerk-react';

export default function SocialFeed() {
  // 1. Use the useUser hook to get the current userId and create a state for _id
  const { user } = useUser();
  const userId = user.id;
  const [_id, set_id] = useState(null);

  // 2. Use the userId to get the _id of the user
  const handleGetUser = async () => {
    console.log('get user');
    const response = await fetch(`/api/user_id?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      set_id(await response.json())
    }
  };

  // 3. Call the handleGetUser function
  useEffect(() => {
    handleGetUser();
  }, []);




  // 1. Create variables for the workouts and items per page
  const [workouts, setWorkouts] = useState([]);
  var itemsPerPage = 1

  // 2. Create a function to get all public workouts
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

  // 3. Call the handleGetAllPublicWorkouts function every time itemsPerPage changes
  useEffect(() => {
    handleGetAllPublicWorkouts(1, itemsPerPage);
    console.log("Use effect called")
  }, [itemsPerPage]);

  // 4. Create a function to load more workout when the button is clicked
  const loadMore = () => {
    itemsPerPage = itemsPerPage + 1;
    handleGetAllPublicWorkouts(1, itemsPerPage);
  };




  return (
    <div className="flex flex-col space-y-8 p-20 items-center justify-center"> 
      {workouts.map((workout) => (
        <SocialWorkoutCard 
          key={workout._id} 
          _id={_id} 
          userId={userId} 
          author={workout.name} 
          workout={workout.workouts} 
        />
      ))}
      <Button onClick={loadMore}>
        Show More
      </Button>
    </div>
  );
}
  
