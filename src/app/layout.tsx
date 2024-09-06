import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
import { cn } from '@/lib/utils';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AuthProvider from '@/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/Theme-provider';
import ReactQueryClientProvider from '@/lib/ReactQueryClientProvider';

export const metadata: Metadata = {
  title: 'FitConnect | Your Fitness goto App',
  description:
    "FitConnect is a fitness app that helps you to stay fit and healthy. It's a one-stop solution for all your fitness needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Need suppressHydrationWarning to suppress hydration warnings because next-theme is updating this element (no worries, it only suppresses 1 level deep warning)
    // Refer for more Info: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <ReactQueryClientProvider>
            <AuthProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </AuthProvider>
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
