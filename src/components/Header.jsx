import Link from 'next/link';
import { buttonVariants, Button } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';

export default function Header() {
  const { userId } = auth();

  return (
    <div className="bg-slate-900">
      <div className="container mx-auto flex items-center justify-between py-2">
        <div className="flex gap-2 items-center">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        {userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
