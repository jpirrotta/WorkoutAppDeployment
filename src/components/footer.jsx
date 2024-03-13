import React from 'react';
import Link from 'next/link';
import Twitter from '@/components/svgs/X.svg';
import Facebook from '@/components/svgs/Facebook.svg';
import Linkedin from '@/components/svgs/Linkedin.svg';
import Youtube from '@/components/svgs/Youtube.svg';
import Instagram from '@/components/svgs/Instagram.svg';
// importing the icon specifier component
import { StyledIcon } from '@/components/StyledIcon';

export default function Footer() {
    const links = [
        {
            id: 1,
            title: "Home",
            link: "home",
        },
        {
            id: 2,
            title: "About Us",
            link: "about-us",
        },
        {
            id: 3,
            title: "My Account",
            link: "user-profile",
        },
        {
            id: 5,
            title: "Contact Us",
            link: "#",
        }
    ]
    return (
        <div className="bg-rose-600">
            <div className="max-w-screen-lg py-8 px-4 md:px-6 md:divide-x text-gray-100 md:flex mx-auto justify-center">
                <div className="p-5 text-center md:w-1/6 border-indigo-950 md:text-left">
                    <div className="uppercase text-indigo-950 font-bold">Menu</div>
                    <ul>
                        {links.map(({ id, title, link }) => (
                            <li
                                key={id}
                                className="my-2"
                            >
                                <Link className='hover:text-gray-300' href={link}>
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-5 text-center xl:w-4/6 md:w-3/6 border-indigo-950">
                    <h3 className="uppercase font-bold text-xl text-indigo-950 mb-4">Componentity</h3>
                    <p className="text-gray-100 text-sm mb-10">Thinking of adding a Input area for User{'\''}s Email Address to provide them daily updates and other news</p>
                </div>
                <div className="text-center md:text-left p-5 md:w-1/6 border-indigo-950">
                    <div className="uppercase text-indigo-950 font-bold">Contact Us</div>
                    <ul>
                        <li className="my-2">
                            <p>XXX XXXX, Seneca Newnham, North York</p>
                        </li>
                        <li className="my-2">
                            <a className="hover:text-gray-300" href="#">contact@company.com</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex py-3 m-auto text-gray-800 text-sm flex-col items-center border-t max-w-screen-xl border-indigo-950">
                <div className="md:flex-auto md:flex-row mt-2 flex-row flex">
                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Twitter}
                            w={'130%'}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Facebook}
                            w={'130%'}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Linkedin}
                            w={'130%'}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Youtube}
                            w={'130%'}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Instagram}
                            w={'130%'}
                        />
                    </Link>
                </div>
                <div className="my-5 text-indigo-950">© Copyright 2024. All Rights Reserved.</div>
            </div>
        </div>
    );
}
