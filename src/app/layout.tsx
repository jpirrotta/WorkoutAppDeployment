import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@clerk/nextjs/server';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AdminPanelLayout from '@/components/user-panel/admin-panel-layout';

import { cn } from '@/lib/utils';
import AuthProvider from '@/auth/AuthProvider';
import { ThemeProvider } from '@/lib/Theme-provider';
import ReactQueryClientProvider from '@/lib/ReactQueryClientProvider';
import { Toaster } from '@/components/ui/sonner';
import { Provider } from 'jotai';

const inter = Inter({ subsets: ['latin'] });
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
  const { userId } = auth();
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
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
          >
            <ReactQueryClientProvider>
              <AuthProvider>
                {userId ? (
                  <AdminPanelLayout>{children}</AdminPanelLayout>
                ) : (
                  <>
                    <Header />
                    <main className="flex flex-col items-center justify-between">
                      {children}
                    </main>
                    <Footer />
                  </>
                )}
              </AuthProvider>
              <Toaster
                richColors
                closeButton
                visibleToasts={50}
                duration={5000}
              />
            </ReactQueryClientProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
