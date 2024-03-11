import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavBar } from './nav-bar';

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
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <NavBar></NavBar>
          <div className='container mx-auto'>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
