import React, { createContext, useContext, useState, useEffect } from 'react';const ThemeContext = createContext();export const themes = {
violet: {
name: 'Violet',
primary: '#571249',
secondary: '#9917f0ff',
accent: '#a855f7',
gradient: 'linear-gradient(135deg, #571249, #9917f0ff)'
},
blue: {
name: 'Bleu',
primary: '#04055cff',
secondary: '#1e21dbff',
accent: '#1e21dbff',
gradient: 'linear-gradient(135deg, #04055cff, #1e21dbff)'
},
orange: {
name: 'Orange',
primary: '#ef6644ff',
secondary: '#f97316',
accent: '#dc2626',
gradient: 'linear-gradient(135deg, #ef6644ff, #f97316)'
},
green: {
name: 'Vert',
primary: '#0a7531ff',
secondary: '#10b981',
accent: '#34d399',
gradient: 'linear-gradient(135deg, #0a7531ff, #10b981)'
},
jaune: {
name: 'Jaune',
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
secondary: '#77ddecff',
accent: '#0891b2',
gradient: 'linear-gradient(135deg, #06b6d4, #77ddecff)'
},
red: {
name: 'Rouge',
primary: '#ff0000ff',
secondary: '#e7902cff',
accent: '#dc2626',
gradient: 'linear-gradient(135deg, #ff0000ff, #e7902cff)'
},
caca: {
name: 'Caca',
primary: '#572403ff',
secondary: '#834019ff',
accent: '#ac5c2dff',
gradient: 'linear-gradient(135deg, #572403ff, #ac5c2dff)'
}
};export const ThemeProvider = ({ children }) => {
const [isDarkMode, setIsDarkMode] = useState(() => {
const saved = localStorage.getItem('spotizer-dark-mode');
return saved !== null ? JSON.parse(saved) : true;
});const [colorTheme, setColorTheme] = useState(() => {
const saved = localStorage.getItem('spotizer-color-theme');
return saved || 'violet';
});useEffect(() => {
localStorage.setItem('spotizer-dark-mode', JSON.stringify(isDarkMode));
}, [isDarkMode]);useEffect(() => {
localStorage.setItem('spotizer-color-theme', colorTheme);
}, [colorTheme]);const toggleDarkMode = () => setIsDarkMode(!isDarkMode);const currentTheme = themes[colorTheme] || themes.violet;return (
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
};export const useTheme = () => useContext(ThemeContext);
