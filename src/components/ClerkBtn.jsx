'use client';
import { UserButton } from '@clerk/nextjs';

export default function ClerkBtn() {
  return (
    <div>
      <UserButton
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
      />
    </div>
  );
}
