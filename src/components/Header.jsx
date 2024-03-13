'use client'

import * as React from "react"
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';

// Light/Dark Mode theme import
import { useTheme } from "next-themes"

// Icon imports
import {  StyledIcon } from "./StyledIcon";
import Menu from "@/components/svgs/Menu.svg"
import Cross from "@/components/svgs/Cross.svg"
import Sun from "@/components/svgs/Sun.svg"
import Moon from "@/components/svgs/Moon.svg"

export default function Header({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // checking for dark mode on every render
  const isDarkMode = theme === 'dark'

  // Change Mode
  const handleMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark'
    console.log(newMode)
    setTheme(newMode)
  }

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    setIsOpen(!isOpen)
  };

  return (
    <div className="bg-slate-900">
      <div className="flex justify-between py-2">
        <div className="container items-center hidden md:block mt-1">
          <Link href="/" className={buttonVariants()} style={{ marginRight: 15 }}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        <div className="container md:hidden">
          {isOpen ?
            <StyledIcon Icon={Cross} w={'10%'} className="text-primary" onClick={toggleMenu} />
            :
            <StyledIcon Icon={Menu} w={'10%'} className="text-primary" onClick={toggleMenu} />
          }
        </div>
        {isDarkMode ? (
          <StyledIcon Icon={Sun} w={'4%'} className="text-primary hover:cursor-pointer" onClick={handleMode} />
        ) : (
          <StyledIcon Icon={Moon} w={'4%'} className="text-primary hover:cursor-pointer" onClick={handleMode} />

        )}
        {user ? (
          <UserButton afterSignOutUrl="/" userProfileMode="navigation"
            userProfileUrl="/user-profile" />
        ) : (
          <SignInButton mode="modal" className={buttonVariants()} />
        )}
      </div>
      <div
        id="mobile-menu"
        className="hidden md:hidden bg-gray-800 py-4"
      >
        <ul className="flex flex-col items-center">
          <li className='mb-4'>
            <Link href="/" className="px-4 cursor-pointer capitalize py-6 text text-white" style={{ color: "#e11d48" }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about-us" className="px-4 cursor-pointer capitalize py-6 text text-white" style={{ color: "#e11d48" }}>
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}