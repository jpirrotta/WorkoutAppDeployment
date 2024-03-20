"use client"

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from "next-themes";

// taking care of setting profile theme 
export default function Providers({ children }) {
    const { theme } = useTheme();

    console.log(`Profile theme set to ${theme}`)

    return (
        <ClerkProvider
            appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                variables: { colorPrimary: '#E11D49' },
                elements: {
                    userButtonPopoverCard:
                        'mt-1 w-[65%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[20%]',
                    card: 'shadow-none w-full dark:bg-background radius-2xl light: border-2 light: border-border my-6',
                    rootBox: 'flex flex-row-reverse w-full radius-2xl mr-5',
                },
            }}
        >
            {children}
        </ClerkProvider>
    )
}