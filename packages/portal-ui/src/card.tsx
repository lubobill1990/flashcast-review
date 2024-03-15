import React from 'react';

export const Card: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className='rounded-lg bg-[#ffffffaa] opacity-80'
      style={{
        filter: 'drop-shadow(4px 4px 20px rgba(128, 132, 255, 0.2))',
      }}
    >
      {children}
    </div>
  );
};
