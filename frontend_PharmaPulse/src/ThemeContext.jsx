// theme_context.js
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.setProperty('--text-color', '#fffff');
      root.style.setProperty('--bg-color', '#121212');
      root.style.setProperty('--card-bg-color', '#1e293b');
      root.style.setProperty('--card-text-color', '#e0f2f1');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--text-color', '#fffff');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--card-bg-color', '#ccfbf1');
      root.style.setProperty('--card-text-color', '#065f46');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
