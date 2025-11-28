import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  violet: {
    name: 'Violet',
    primary: '#9333ea',
    secondary: '#ec4899',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #9333ea, #ec4899)'
  },
  blue: {
    name: 'Bleu',
    primary: '#3b82f6',
    secondary: '#06b6d4',
    accent: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
  },
  red: {
    name: 'Rouge',
    primary: '#ef4444',
    secondary: '#f97316',
    accent: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)'
  },
  green: {
    name: 'Vert',
    primary: '#22c55e',
    secondary: '#10b981',
    accent: '#34d399',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)'
  },
  orange: {
    name: 'Orange',
    primary: '#f97316',
    secondary: '#eab308',
    accent: '#fb923c',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)'
  },
  pink: {
    name: 'Rose',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#db2777',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
  },
  cyan: {
    name: 'Cyan',
    primary: '#06b6d4',
    secondary: '#22d3ee',
    accent: '#0891b2',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('spotizer-dark-mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('spotizer-color-theme');
    return saved || 'violet';
  });

  useEffect(() => {
    localStorage.setItem('spotizer-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('spotizer-color-theme', colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const currentTheme = themes[colorTheme] || themes.violet;

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      colorTheme,
      setColorTheme,
      currentTheme,
      themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
