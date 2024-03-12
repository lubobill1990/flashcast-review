import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavBar } from './nav-bar';
import { ThemeSwitch } from './theme-switch';
import { cookies, headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlashCast Exp Portal',
  description: 'To evaluate the clip generation quality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: string = cookies().get('next-theme')?.value ?? 'light';

  return (
    <html lang='en' className={theme} style={{ colorScheme: theme }}>
      <body className={inter.className}>
        <Providers>
          <NavBar></NavBar>
          <div className='container mx-auto'>{children}</div>
          <footer className='flex'>
            <p className='flex-1'>© {new Date().getFullYear()} FlashCast</p>
            <ThemeSwitch></ThemeSwitch>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
