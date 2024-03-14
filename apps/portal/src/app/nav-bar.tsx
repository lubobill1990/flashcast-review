import Link from 'next/link';
import { AuthButton } from './login';

export const NavBar = () => {
  return (
    <nav className='flex justify-center'>
      <span className='flex-1 flex gap-3'>FlashCast Reels Portal</span>
      {/* <ul className='flex-1 flex gap-3'>
        <li className=''>
          <Link className='p-4 flex justify-center align-center' href='/'>
            Home
          </Link>
        </li>
        <li>
          <Link
            className='p-4 flex justify-center align-center'
            href='/experiment'
          >
            Experiments
          </Link>
        </li>
        <li>
          <Link className='p-4 flex justify-center align-center' href='/sample'>
            Samples
          </Link>
        </li>
      </ul> */}
      <ul>
        <li>
          <AuthButton />
        </li>
      </ul>
    </nav>
  );
};
