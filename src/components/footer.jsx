import React from 'react';
import Link from 'next/link';

// importing Icons
import Twitter from '@/components/svgs/X.svg';
import Facebook from '@/components/svgs/Facebook.svg';
import Youtube from '@/components/svgs/Youtube.svg';
import Instagram from '@/components/svgs/Instagram.svg';

// importing the icon specifier component
import { StyledIcon } from '@/components/StyledIcon';

const ICON_SIZE = '2rem';

export default function Footer() {
  const links = [
    {
      id: 1,
      title: 'Home',
      link: 'home',
    },
    {
      id: 2,
      title: 'Workout',
      link: 'workout',
    },
    {
      id: 3,
      title: 'My Account',
      link: 'user-profile',
    },
    {
      id: 5,
      title: 'Contact Us',
      link: 'contact-us',
    },
  ];
  return (
    <div className="bg-primary">
      <div className="max-w-screen-lg py-8 px-4 md:px-6 md:divide-x text-gray-100 md:flex mx-auto justify-center">
        <div className="p-5 text-center md:w-1/6 border-indigoTouch md:text-left">
          <div className="uppercase text-indigoTouch font-bold">Menu</div>
          <ul>
            {links.map(({ id, title, link }) => (
              <li key={id} className="my-3">
                <Link className="hover:text-gray-300" href={link}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 text-center xl:w-4/6 md:w-3/6 border-indigoTouch">
          <h3 className="uppercase font-bold text-xl text-indigoTouch mb-4">
            Componentity
          </h3>
          <p className="text-sm mb-10">
            Thinking of adding a Input area for User{"'"}s Email Address to
            provide them daily updates and other news
          </p>
        </div>
        <div className="text-center md:text-left p-5 md:w-1/6 border-indigoTouch">
          <div className="uppercase text-indigoTouch font-bold">Contact Us</div>
          <ul>
            <li className="my-2">
              <p>XXX XXXX, Seneca Newnham, North York</p>
            </li>
            <li className="my-3">
              <a className="hover:text-gray-300" href="#">
                contact@company.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex py-3 m-auto text-sm flex-col items-center border-t max-w-screen-xl border-indigoTouch">
        <div className="social-icons md:flex-auto md:flex-row mt-2 flex-row flex">
          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={Twitter} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={Facebook} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={Youtube} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={Instagram} w={ICON_SIZE} />
          </Link>
        </div>
        <div className="my-5 text-indigoTouch">
          © Copyright 2024. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
