import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavBar } from './nav-bar';
import { ThemeSwitch } from './theme-switch';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { LoginButton } from './login';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlashCast Exp Portal',
  description: 'To evaluate the clip generation quality.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: string = cookies().get('next-theme')?.value ?? 'light';
  const session = await getServerSession();
  return (
    <html lang='en' className={theme} style={{ colorScheme: theme }}>
      <body className={inter.className}>
        {session?.user && (
          <Providers session={session}>
            <NavBar></NavBar>
            <div className='container mx-auto'>{children}</div>
            <footer className='flex'>
              <p className='flex-1'>© {new Date().getFullYear()} FlashCast</p>
              <ThemeSwitch></ThemeSwitch>
            </footer>
          </Providers>
        )}

        {!session?.user && (
          <div className='flex justify-center p-8'>
            <LoginButton />
          </div>
        )}
      </body>
    </html>
  );
}
