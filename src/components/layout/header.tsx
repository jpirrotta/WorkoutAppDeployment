'use client';

import * as React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Light/Dark Mode theme decider import
import { useTheme } from 'next-themes';

// Icon imports
import { StyledIcon } from '@/components/StyledIcon';
import logger from '@/lib/logger';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { isSignedIn } = useAuth();
  // State vars
  // State var for opening and closing of navbar Menu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // State var for mounting particular theme (light/dark) during CSR
  const [mounted, setMounted] = useState<boolean>(false);

  // Handle root theme of our webApp
  const { theme, setTheme } = useTheme();

  // Avoid Hydration Mismatch: useEffect only runs on the client, so now we can safely show the UI
  // Refer for more info: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // return nothing until UI is not mounted on client side
  if (!mounted) {
    return null;
  }

  // checking for dark mode on every render
  const isDarkMode = theme === 'dark';

  // Change Mode
  const handleMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    logger.info(`Changing Theme Mode to ${newMode}`);
    setTheme(newMode);
  };

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
      <div className="flex flex-row items-center py-2 dark:bg-background light:bg-gray-500">
        {/* Links */}
        <div className="flex basis-1/3 space-x-3 items-center max-md:hidden mt-1">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        {/* end of links */}
        {/* mobile burger */}
        <div className="flex basis-1/3 md:hidden">
          {isOpen ? (
            <StyledIcon
              Icon={X}
              w={'1.7rem'}
              className="text-primary"
              onClick={toggleMenu}
            />
          ) : (
            // mobile cross
            <StyledIcon
              Icon={Menu}
              w={'1.7rem'}
              className="text-primary"
              onClick={toggleMenu}
            />
          )}
        </div>
        {/* Switching between Light/Dark Mode */}
        <div className="theme-toggle flex basis-1/3 justify-center">
          {isDarkMode ? (
            <StyledIcon
              Icon={Sun}
              w={'2rem'}
              className="text-primary hover:cursor-pointer"
              onClick={handleMode}
            />
          ) : (
            <StyledIcon
              Icon={Moon}
              w={'2rem'}
              className="text-primary hover:cursor-pointer"
              onClick={handleMode}
            />
          )}
        </div>
        {/* Check if the user is signed in and show their profile */}
        <div className="flex justify-end basis-1/3 pr-2">
          <div className='justify-end'>
            {isSignedIn ? (
              <UserButton
                // TODO deal with afterSignOutUrl being deprecated soon
                afterSignOutUrl="/"
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
              />
            ) : (
              <SignInButton mode="modal" />
            )}
          </div>
        </div>
      </div>
      {/* Navbar Menu for responsiveness (for smaller screens) */}
      <div id="mobile-menu" className="hidden md:hidden bg-background py-4">
        <ul className="flex flex-col items-center">
          <li className="mb-4">
            <Link
              href="/"
              className="px-4 cursor-pointer capitalize py-6 text text-white"
              style={{ color: '#e11d48' }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="px-4 cursor-pointer capitalize py-6 text text-white"
              style={{ color: '#e11d48' }}
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
