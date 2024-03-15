'use client'

import React from 'react';
import { makeStyles, mergeClasses, shorthands } from '@fluentui/react-components';
import Link from 'next/link';

const useStyles = makeStyles({
  header: {
    minHeight: '50px',
    maxHeight: '50px',
    display: 'flex',
    fontSize: '14px',
    ...shorthands.padding(0, '34px'),
    ...shorthands.borderBottom('1px', 'solid', 'rgba(0, 0, 0, .1)'),
  },
  tab: {
    ...shorthands.padding('12px', '10px'),
  },
  activeTab: {
    fontWeight: 'bold',
    ...shorthands.borderBottom('3px', 'solid', '#5B5FC7')
  },
  container: {
    ...shorthands.padding('15px', '34px'),
  }
});

interface IMainPageCardProps extends React.PropsWithChildren {
  activePage: 'start_generating' | 'my_reels'
}

export const MainPageCard: React.FC<IMainPageCardProps> = ({ activePage, children }) => {
  const classes = useStyles();
  return (
    <div
      className='rounded-lg bg-[#ffffffdd]'
      style={{
        filter: 'drop-shadow(4px 4px 20px rgba(128, 132, 255, 0.2))',
      }}
    >
      <div className={classes.header}>
        <Link
          href='/start-generating'
          className={
            mergeClasses(
              classes.tab,
              activePage === 'start_generating' && classes.activeTab,
            )
          }
          style={{marginRight: '5px'}}
        >
          Start generating
        </Link>
        <Link
          href='/my-reels'
          className={
            mergeClasses(
              classes.tab,
              activePage === 'my_reels' && classes.activeTab,
            )
          }
        >
          My reels
        </Link>
      </div>
      <div className={classes.container}>
        {children}
      </div>
    </div>
  );
};
