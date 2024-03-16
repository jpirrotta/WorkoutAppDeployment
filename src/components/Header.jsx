'use client';

import * as React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Light/Dark Mode theme import
import { useTheme } from 'next-themes';

// Icon imports
import { StyledIcon } from '@/components/StyledIcon';
import Menu from '@/components/svgs/Menu.svg';
import Cross from '@/components/svgs/Cross.svg';
import Sun from '@/components/svgs/Sun.svg';
import Moon from '@/components/svgs/Moon.svg';
import logger from '@/lib/logger';

export default function Header({ user }) {
  // state vars
  // state var for opening and closing of navbar Menu
  const [isOpen, setIsOpen] = useState(false);
  // state var for mounting particular theme (light/dark) during CSR
  const [mounted, setMounted] = useState(false);

  // handling root theme of our webApp
  const { theme, setTheme } = useTheme('dark');

  // Avoid Hydration Mismatch: useEffect only runs on the client, so now we can safely show the UI
  // Refer for more info: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // handling toggling of Navbar Menu (for Responsive design)
  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="flex flex-row justify-between items-center py-2 dark:bg-background light:bg-gray-500">
        {/* Links */}
        <div className="container basis-1/3 space-x-3 items-center hidden md:block mt-1">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        {/* end of links */}
        {/* mobile burger */}
        <div className="container basis-1/3 md:hidden">
          {isOpen ? (
            <StyledIcon
              Icon={Cross}
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
        <div className="theme-toggle flex basis-1/3 justify-center ">
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
        <div className="container basis-1/3 flex justify-end">
          {user ? (
            <UserButton
              afterSignOutUrl="/"
              userProfileMode="navigation"
              userProfileUrl="/user-profile"
            />
          ) : (
            <SignInButton mode="modal" className={buttonVariants()} />
          )}
        </div>

        {/* Navbar Menu for responsiveness (for smaller screens) */}
      </div>
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
