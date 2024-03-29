'use client';
import Cookies from 'universal-cookie';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const cookies = new Cookies(null, { path: '/' });
    const prevTheme = cookies.get('next-theme');
    if (prevTheme !== theme) {
      cookies.set('next-theme', theme);
    }
  }, [theme]);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select
      value={theme}
      onChange={(e) => {
        setTheme(e.target.value);
      }}
    >
      <option value='system'>System</option>
      <option value='dark'>Dark</option>
      <option value='light'>Light</option>
    </select>
  );
};
