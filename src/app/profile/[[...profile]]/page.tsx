'use client';
// TODO Check if the use client is needed here
import { UserProfile } from '@clerk/nextjs';
import Profile from '@/components/profile/ProfileForm';
import { UserSearch } from 'lucide-react';

export default function UserProfilePage() {
  return (
    <UserProfile path="/profile" routing="path">
      <UserProfile.Page
        label="fdfd"
        url="profile"
        labelIcon={<UserSearch className='size-4' />}
      >
        <Profile />
      </UserProfile.Page>
      <UserProfile.Page label="account" />
      <UserProfile.Page label="security" />
    </UserProfile>
  );
}
