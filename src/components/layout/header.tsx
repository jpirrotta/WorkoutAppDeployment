'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
// Icon imports
import { StyledIcon } from '@/components/StyledIcon';
import { Menu, X } from 'lucide-react';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function Header() {
  const { isSignedIn } = useUser();
  // State var for opening and closing of navbar Menu
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Check if the component has mounted
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  // handle toggling of Navbar Menu (for Responsive design)
  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="flex flex-row justify-between items-center py-2 dark:bg-background light:bg-gray-500">

        {/* TO DO: fix spacing between nav items and delete nav sections below */}
        <nav className="container basis-1/3 space-x-3 items-center hidden md:block mt-2">
        </nav>
        <div className="container basis-1/3 md:hidden"></div>

        {/* Switching between Light/Dark Mode */}
        <div className="theme-toggle flex basis-1/3 justify-center">
          <ThemeToggle />
        </div>
        {/* Check if the user is signed in and show their profile */}
        <div className="pr-2 basis-1/3 flex justify-end">
          {isSignedIn ? (
            <UserButton
              // TODO deal with afterSignOutUrl being deprecated soon
              afterSignOutUrl="/"
              userProfileMode="navigation"
              userProfileUrl="/profile"
            />
          ) : (
            <Button asChild>
              <SignInButton mode="modal" />
            </Button>
          )}
        </div>
      </div>
      {/* Navbar Menu for responsiveness (for smaller screens) */}
      <nav id="mobile-menu" className="hidden md:hidden bg-background py-4">
        <ul className="flex flex-col items-center">
          <li className="mb-4">
            <Link href="/" className="px-4 cursor-pointer capitalize py-6">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="px-4 cursor-pointer capitalize py-6"
            >
              About Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
