import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "portal-ui";
// import { ThemeSwitch } from './theme-switch';
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { LoginButton } from "./login";
import factory from "@/factory";
import bgImg from "@/asset/bg.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlashCast Exp Portal",
  description: "To evaluate the clip generation quality.",
};

async function init() {
  const session = await getServerSession();
  if (session?.user) {
    const user = await factory.userService.createUser(
      session.user.name ?? "",
      session.user.email ?? ""
    );
    console.log(user);
  }
  return session;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: string = cookies().get("next-theme")?.value ?? "light";
  const session = await init();

  return (
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <body
        className={inter.className}
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        {session?.user && (
          <Providers session={session}>
            <NavBar></NavBar>
            <div className="container mx-auto py-16 px-2">{children}</div>
            <footer className="flex">
              <p className="flex-1">© {new Date().getFullYear()} FlashCast</p>
              {/* <ThemeSwitch></ThemeSwitch> */}
            </footer>
          </Providers>
        )}

        {!session?.user && (
          <div className="flex justify-center p-8">
            <LoginButton />
          </div>
        )}
      </body>
    </html>
  );
}
