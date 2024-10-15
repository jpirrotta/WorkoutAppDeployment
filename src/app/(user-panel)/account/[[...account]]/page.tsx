import { UserProfile as UserAccount, UserProfile } from '@clerk/nextjs';

export default function UserAccountPage() {
  return (
    <UserAccount
      appearance={{
        elements: {
          rootBox: 'h-full items-center justify-center',
          cardBox: 'h-full border-0 rounded-lg shadow-none bg-transparent',
          scrollBox: 'border-0 rounded-lg shadow-none bg-transparent',
          navbar: 'border-0 rounded-lg shadow-none bg-transparent',
        },
      }}
      path="/account"
      routing="path"
    />
  );
}
