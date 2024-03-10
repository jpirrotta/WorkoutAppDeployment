// auth
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

// styles
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

// components
import Header from '@/components/Header';

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
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ClerkProvider>
          <Header user={userId} />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
