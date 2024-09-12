import React from 'react';
import Link from 'next/link';

// importing Icons
import {
  SiInstagram,
  SiX,
  SiYoutube,
  SiFacebook,
} from '@icons-pack/react-simple-icons';

// importing the icon specifier component
import { StyledIcon } from '@/components/StyledIcon';

import { FooterNewsLetterSignUp } from '../NewsLetterSignUp';

const ICON_SIZE = '2rem';

type LinkItem = Readonly<{
  title: string;
  link: string;
}>;

export default function Footer() {
  const links: LinkItem[] = [
    {
      title: 'Home',
      link: '/',
    },
    {
      title: 'About Us',
      link: 'about-us',
    },
    {
      title: 'My Account',
      link: 'profile',
    },
    {
      title: 'Contact Us',
      link: 'contact-us',
    },
  ];
  return (
    <footer className="bg-primary">
      <div className="max-w-screen-lg py-8 px-4 md:px-6 md:divide-x text-gray-100 md:flex mx-auto justify-center">
        <section className="p-5 text-center md:w-1/6 border-indigoTouch md:text-left">
          <h4 className="uppercase text-indigoTouch font-bold">Menu</h4>
          <ul>
            {links.map(({ title, link }) => (
              <li key={title} className="my-3">
                <Link
                  className="hover:text-gray-300 hover:underline"
                  href={link}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="p-5 text-center xl:w-4/6 md:w-3/6 border-indigoTouch">
          <FooterNewsLetterSignUp />
        </section>
        <section className="text-center md:text-left p-5 md:w-1/6 border-indigoTouch">
          <h4 className="uppercase text-indigoTouch font-bold">Contact Us</h4>
          <ul>
            <li className="my-2">
              <span>Seneca Newnham, North York</span>
            </li>
            <li className="my-3">
              <Link className="hover:text-gray-300" href="/contact-us">
                FitConnectCA@company.com
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <div className="flex py-3 m-auto text-sm flex-col items-center border-t max-w-screen-xl border-indigoTouch">
        <div className="social-icons md:flex-auto md:flex-row mt-2 flex-row flex">
          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={SiX} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={SiFacebook} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={SiYoutube} w={ICON_SIZE} />
          </Link>

          <Link
            href="#"
            className="w-6 mx-6 text-indigoTouch hover:text-gray-300 duration-200"
          >
            <StyledIcon Icon={SiInstagram} w={ICON_SIZE} />
          </Link>
        </div>
        <div className="my-5 text-indigoTouch">
          © Copyright 2024. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}