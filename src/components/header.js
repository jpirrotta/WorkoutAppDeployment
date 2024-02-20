import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { auth } from '@clerk/nextjs';

export default function Header() {
  const { userId } = auth();

  return (
    <div className="bg-gray-600 text-neutral-100">
      <div className="container mx-auto flex items-center justify-between py-2">
        <Link
          className={buttonVariants({ variant: 'outline' })}
          variant="outline"
          href="/"
        >
          Home
        </Link>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          variant="outline"
          href="/about"
        >
          About Us
        </Link>
        <div>
          <div className="flex gap-2 items-center">
            <Link
              className={buttonVariants({ variant: 'outline' })}
              variant="outline"
              href="#"
            >
              Sign Up
            </Link>
            <Link
              className={buttonVariants({ variant: 'outline' })}
              variant="outline"
              href="#"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
