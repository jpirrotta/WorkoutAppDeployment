import React from 'react';
import Link from 'next/link';
import Twitter from '@/components/svgs/X.svg';
import Facebook from '@/components/svgs/Facebook.svg';
import Linkedin from '@/components/svgs/Linkedin.svg';
import Youtube from '@/components/svgs/Youtube.svg';
import Instagram from '@/components/svgs/Instagram.svg';

const StyledIcon = ({ Icon, ...props }) => {
    return <Icon width={'130%'} {...props} />;
};

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
            <div className="max-w-screen-lg py-8 px-4 sm:px-6 text-gray-100 sm:flex mx-auto justify-center items-center">
                <div className="p-5 text-center sm:w-1/6 border-r border-indigo-950 sm:text-left">
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
                <div className="p-5 text-center sm:w-4/6 border-r border-indigo-950">
                    <h3 className="uppercase font-bold text-xl text-indigo-950 mb-4">Componentity</h3>
                    <p className="text-gray-100 text-sm mb-10">Thinking of adding a Input area for User{'\''}s Email Address to provide them daily updates and other news</p>
                </div>
                <div className="text-center sm:text-left p-5 sm:w-1/6">
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
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Facebook}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Linkedin}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Youtube}
                        />
                    </Link>

                    <Link href="#" className="w-6 mx-6 text-indigo-950 hover:text-gray-300 hover:h-7 hover:w-7 duration-200">
                        <StyledIcon
                            Icon={Instagram}
                        />
                    </Link>
                </div>
                <div className="my-5 text-gray-100">© Copyright 2024. All Rights Reserved.</div>
            </div>
        </div>
    );
}
