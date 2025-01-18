/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for theme preference
    return localStorage.getItem('theme') === 'dark' || false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save preference to localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    // Add or remove the 'dark' class on the root element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
