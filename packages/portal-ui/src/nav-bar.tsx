import Image from "next/image";
import { AuthButton } from "./auth-buttons";

export const NavBar = () => {
  return (
    <nav className="flex justify-between h-[40px] px-5 gap-5 bg-white">
      <a href="/" className="flex items-center text-sm font-bold">
        <Image
          src="/logo.svg"
          height={24}
          alt="logo"
          width={40}
          className="mr-2"
        />
        FlashCast Reels Portal
      </a>
      {/* <ul className='flex-1 flex gap-3'>
        <li className=''>
          <a className='p-4 flex justify-center align-center' href='/'>
            Home
          </a>
        </li>
        <li>
          <a
            className='p-4 flex justify-center align-center'
            href='/experiment'
          >
            Experiments
          </a>
        </li>
        <li>
          <a className='p-4 flex justify-center align-center' href='/sample'>
            Samples
          </a>
        </li>
      </ul> */}
      <div className="flex items-center gap-3">
        <AuthButton />
      </div>
    </nav>
  );
};
