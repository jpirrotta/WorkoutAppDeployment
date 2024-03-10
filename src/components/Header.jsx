'use client'

import * as React from "react"
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function Header({ user }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    setIsOpen(!isOpen)
  };

  return (
    <div className="bg-slate-900">
      <div className="container mx-auto flex items-center justify-between py-2">
        <div className="flex gap-2 items-center hidden md:block">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/about-us" className={buttonVariants()}>
            About Us
          </Link>
        </div>
        <div className="md:hidden">
          {isOpen ?
            <FaTimes size={30} onClick={toggleMenu} className="text-2xl cursor-pointer" style={{ color: "#e11d48" }} />
            :
            <FaBars
              onClick={toggleMenu}
              className="text-2xl cursor-pointer"
              style={{ color: "#e11d48" }}
            />
          }
        </div>
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
