import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-raleway antialiased',
          raleway.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
