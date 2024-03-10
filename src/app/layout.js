// auth
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

// styles
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

// components
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/Toaster';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Workout Plan',
  description: 'workout to your limits',
};

export default function RootLayout({ children }) {
  const { userId } = auth()

  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-slate-900 font-sans antialiased',
          fontSans.variable
        )}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: { colorPrimary: '#E11D49' },
            elements: {
              userButtonPopoverCard:
                'mt-1 w-[65%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[20%]',
              card: 'shadow-none w-full bg-slate-900 text-primary-foreground radius-2xl ',
              rootBox:
                'flex w-full text-primary-foreground bg-slate-900 radius-2xl',
            },
          }}
        >
          <Header user={userId} />
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
