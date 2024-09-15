'use client';

import * as React from 'react';
import Link from 'next/link';
import { buttonVariants, Button } from '@/components/ui/button';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../theme-toggle';
// Icon imports
import { StyledIcon } from '@/components/StyledIcon';
import logger from '@/lib/logger';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { isSignedIn } = useAuth();
  // State var for opening and closing of navbar Menu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // State var for mounting particular theme (light/dark) during CSR
  const [mounted, setMounted] = useState<boolean>(false);

  // Avoid Hydration Mismatch: useEffect only runs on the client, so now we can safely show the UI
  // Refer for more info: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // return nothing until UI is not mounted on client side
  if (!mounted) {
    return null;
  }

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
        {/* Links */}
        <nav className="container basis-1/3 space-x-3 items-center hidden md:block mt-1">
          <ul className="flex space-x-3">
            <li>
              <Link href="/" className={buttonVariants()}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className={buttonVariants()}>
                About Us
              </Link>
            </li>
          </ul>
        </nav>
        {/* end of links */}
        {/* mobile burger */}
        <div className="container basis-1/3 md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? (
              <StyledIcon Icon={X} w={'1.7rem'} className="text-primary" />
            ) : (
              <StyledIcon Icon={Menu} w={'1.7rem'} className="text-primary" />
            )}
          </button>
        </div>
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
            <SignInButton mode="modal" />
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
