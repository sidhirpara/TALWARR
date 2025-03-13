import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`w-6 h-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300 absolute inset-0 ${
            theme === 'light' ? 'transform opacity-100 rotate-0' : 'transform opacity-0 rotate-90'
          }`}
        />
        <Moon
          className={`w-6 h-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300 absolute inset-0 ${
            theme === 'dark' ? 'transform opacity-100 rotate-0' : 'transform opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  );
}