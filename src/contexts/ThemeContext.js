import React, { createContext, useContext, useState, useEffect } from 'react';
import { shadeColor } from '../utils';const ThemeContext = createContext();export const themes = {
violet: {
name: 'Violet',
primary: '#571249',
secondary: '#9917f0',
accent: '#a855f7',
gradient: 'linear-gradient(135deg, #571249, #9917f0)'
},
blue: {
name: 'Bleu',
primary: '#04055c',
secondary: '#1e21db',
accent: '#4548e0',
gradient: 'linear-gradient(135deg, #04055c, #1e21db)'
},
orange: {
name: 'Orange',
primary: '#ef6644',
secondary: '#f97316',
accent: '#dc2626',
gradient: 'linear-gradient(135deg, #ef6644, #f97316)'
},
vert: {
name: 'Vert',
primary: '#0a7531',
secondary: '#10b981',
accent: '#34d399',
gradient: 'linear-gradient(135deg, #0a7531, #10b981)'
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
secondary: '#77ddec',
accent: '#0891b2',
gradient: 'linear-gradient(135deg, #06b6d4, #77ddec)'
},
red: {
name: 'Rouge',
primary: '#ff0000',
secondary: '#994646',
accent: '#dc2626',
gradient: 'linear-gradient(135deg, #441010ff, #ff0808ff)'
},
marron: {
name: 'Marron',
primary: '#572403',
secondary: '#834019',
accent: '#ac5c2d',
gradient: 'linear-gradient(135deg, #572403, #ac5c2d)'
}
};const buildCustomTheme = (color) => ({
name: 'Personnalisé',
primary: color,
secondary: shadeColor(color, 18),
accent: shadeColor(color, 32),
gradient: `linear-gradient(135deg, ${shadeColor(color, -28)}, ${color})`
});export const ThemeProvider = ({ children }) => {
const [customColor, setCustomColorState] = useState(() => {
try { return localStorage.getItem('spotizer-custom-color') || '#7c3aed'; } catch (e) { return '#7c3aed'; }
});
const setCustomColor = (c) => {
setCustomColorState(c);
try { localStorage.setItem('spotizer-custom-color', c); } catch (e) {}
};
const allThemes = { ...themes, custom: buildCustomTheme(customColor) };
const [isDarkMode, setIsDarkMode] = useState(() => {
try { const saved = localStorage.getItem('spotizer-dark-mode'); return saved !== null ? JSON.parse(saved) : true; } catch (e) { return true; }
});const [colorTheme, setColorTheme] = useState(() => {
try { const saved = localStorage.getItem('spotizer-color-theme'); return saved && (themes[saved] || saved === 'custom') ? saved : 'violet'; } catch (e) { return 'violet'; }
});useEffect(() => {
localStorage.setItem('spotizer-dark-mode', JSON.stringify(isDarkMode));
}, [isDarkMode]);useEffect(() => {
localStorage.setItem('spotizer-color-theme', colorTheme);
}, [colorTheme]);const toggleDarkMode = () => setIsDarkMode(!isDarkMode);const currentTheme = allThemes[colorTheme] || themes.violet;return (
<ThemeContext.Provider value={{
isDarkMode,
toggleDarkMode,
colorTheme,
setColorTheme,
currentTheme,
themes: allThemes,
customColor,
setCustomColor
}}>
{children}
</ThemeContext.Provider>
);
};export const useTheme = () => useContext(ThemeContext);
