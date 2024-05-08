import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { NavBar } from "portal-ui";
import { cookies } from "next/headers";
import { auth } from "@flashcast/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlashCast Exp Portal",
  description: "To evaluate the clip generation quality.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: string = cookies().get("next-theme")?.value ?? "light";
  const session = await auth();

  return (
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <body
        className={inter.className}
        style={{
          backgroundImage: `url(/bg.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        {session?.user ? (
          <Providers>
            <NavBar></NavBar>
            <div className="container mx-auto py-16 px-2">{children}</div>
            <footer className="hidden">
              <p className="flex-1">© {new Date().getFullYear()} FlashCast</p>
            </footer>
          </Providers>
        ) : (
          <div className="flex items-center justify-center h-screen">
            No Permission
          </div>
        )}
      </body>
    </html>
  );
}
