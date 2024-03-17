// auth
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

// styles
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

// components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/Toaster';
import { ThemeProvider } from '@/components/Theme-provider';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Workout Plan',
  description: 'workout to your limits',
};

export default function RootLayout({ children }) {

  return (
    // Need suppressHydrationWarning to suppress hydration warnings because next-theme is updating this element (no worries, it only suppresses 1 level deep warning)
    // Refer for more Info: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
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
              card: 'shadow-none w-full bg-gray-100 dark:bg-background text-secondary-foreground radius-2xl',
              rootBox:
                'flex flex-row-reverse w-full text-secondary-foreground dark:bg-background radius-2xl mr-5',
              navbarButton: 'text-secondary-foreground hover:bg-card',
            },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
            <Footer />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
