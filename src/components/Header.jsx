'use client'

import * as React from "react"
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
// need for dark/light mode
// import { useTheme } from "next-themes"

export default function Header({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  // const { theme, setTheme } = useTheme()
  // const isDarkMode = theme === 'dark'

  // const toggleMode = () => {
  //   const newMode = isDarkMode ? 'light' : 'dark'
  //   console.log(newMode)
  //   setTheme(newMode)
  // }

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    setIsOpen(!isOpen)
  };

  return (
    <div className="bg-slate-900">
      <div className="flex justify-between py-2">
        <div className="container items-center hidden md:block">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        <div className="container md:hidden">
          {isOpen ?
            <FaTimes size={25} onClick={toggleMenu} className="text-2xl m-2 cursor-pointer" style={{ color: "#e11d48" }} />
            :
            <FaBars
              size={25}
              onClick={toggleMenu}
              className="text-2xl m-2 cursor-pointer"
              style={{ color: "#e11d48" }}
            />
          }
        </div>
        {/* {isDarkMode ? (
          <FaSun size={45} className="text-2xl cursor-pointer" style={{ color: "#e11d48" }} />
        ) : (
          <FaMoon size={45} className="text-2xl cursor-pointer" style={{ color: "#e11d48" }} />
        )} */}
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
            <Link href="/about-us" className="px-4 cursor-pointer capitalize py-6 text text-white">
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}