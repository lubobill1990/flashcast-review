import Image from "next/image";
import { AuthButton } from "./auth-buttons";
import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="flex justify-between h-[40px] px-5 gap-5 bg-white">
      <Link href="/" className="flex items-center text-sm font-bold">
        <Image
          src="/logo.svg"
          height={24}
          alt="logo"
          width={40}
          className="mr-2"
        />
        FlashCast Reels Portal (Slef-host)
      </Link>
      <ul className="flex-1 flex gap-3">
        <li className="flex items-center">
          <Link href="/">Home</Link>
        </li>
      </ul>
      <div className="flex items-center gap-3">
        <AuthButton />
      </div>
    </nav>
  );
};
