'use client';

import Link from 'next/link';
import { AuthButton } from './auth-buttons';

import { makeStyles, shorthands } from '@fluentui/react-components';
import Logo from './logo.svg';
import Image from 'next/image';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    ...shorthands.gap('20px'),
    backgroundColor: '#fff',
    '& a, & button': {
      ...shorthands.padding('4px'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
  },
});

export const NavBar = () => {
  const classes = useStyles();
  return (
    <nav className={classes.root}>
      <Link href='/' className='flex items-center text-sm font-bold'>
        <Logo className='mr-2' />
        FlashCast Reels Portal
      </Link>
      <ul className='flex-1 flex gap-3'>
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
      </ul>
      <ul className='flex gap-3'>
        <li>
          <AuthButton />
        </li>
      </ul>
    </nav>
  );
};
