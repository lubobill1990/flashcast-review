'use client';

import { AuthButton } from './auth-buttons';

import { makeStyles, shorthands } from '@fluentui/react-components';
import Logo from './logo.svg';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
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
      <a href='/' className='flex items-center text-sm font-bold'>
        <Logo className='mr-2' />
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
      <ul className='flex gap-3'>
        <li>
          <AuthButton />
        </li>
      </ul>
    </nav>
  );
};
