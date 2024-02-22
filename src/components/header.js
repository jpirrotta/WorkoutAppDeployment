import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';

export default function Header() {
  const { userId } = auth();

  return (
    <div className="bg-gray-400 text-neutral-100">
      <div className="container mx-auto flex items-center justify-between py-2">
        {userId ? (
          <>
            <div className="flex gap-2 items-center">
              <Link className={buttonVariants({ variant: 'outline' })} variant="outline" href="/">
                Home
              </Link>
              <Link
                className={buttonVariants({ variant: 'outline' })}
                variant="outline"
                href="/about"
              >
                About Us
              </Link>
            </div>
            <UserButton />
          </>
        ) : (
          <div className="flex justify-between w-full items-center">
            <Link
              className={buttonVariants({ variant: 'outline' })}
              variant="outline"
              href="/about"
            >
              About Us
            </Link>

            <Link
              className={buttonVariants({ variant: 'outline' })}
              variant="outline"
              href="/sign-in"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
