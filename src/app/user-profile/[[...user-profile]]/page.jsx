'use client';

import { UserProfile } from '@clerk/nextjs';
import ProfileIcon from '@/components/svgs/ProfileIcon.svg';
import Profile from '@/components/Profile/ProfileForm';

export default function UserProfilePage() {
  return (
    <UserProfile path="/user-profile" routing="path">
      <UserProfile.Page label="Profile" url="profile" labelIcon={<ProfileIcon />}>
        <Profile />
      </UserProfile.Page>
      <UserProfile.Page label="account" />
      <UserProfile.Page label="security" />
    </UserProfile>
  );
};
