// styles
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

// components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthProvider from '../components/AuthProvider';
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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
            >
            <AuthProvider>
            <Header />
            {children}
            <Toaster />
            <Footer />
        </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
