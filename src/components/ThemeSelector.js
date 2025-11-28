import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTheme, themes } from '../contexts/ThemeContext';
import '../App.css';const ThemeSelector = () => {
  const { isDarkMode, toggleDarkMode, colorTheme, setColorTheme, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });  const btnRef = useRef();
  const dropdownRef = useRef();  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();      const dropdownWidth = dropdownRef.current?.offsetWidth || 220;
      const dropdownHeight = dropdownRef.current?.offsetHeight || 260;      let x = rect.left;
      let y = rect.top - dropdownHeight - 10;      
      if (y < 0) {
        y = rect.bottom + 10;
      }      
      if (x + dropdownWidth > window.innerWidth) {
        x = window.innerWidth - dropdownWidth - 10;
      }      
      if (x < 0) x = 10;      setCoords({ x, y });
    }
  }, [isOpen]);  return (
    <div className="theme-selector">
      <button 
        ref={btnRef}
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: currentTheme.gradient }}
        title="Personnaliser le thème"
      >
        🎨
      </button>      {isOpen && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className={`theme-dropdown ${isDarkMode ? 'dark' : 'light'}`}
          style={{ top: coords.y, left: coords.x }}
        >
          <div className="theme-section">
            <h4>Mode d'affichage</h4>
            <div className="theme-mode-toggle">
              <button 
                className={`mode-btn ${isDarkMode ? 'active' : ''}`}
                onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                style={isDarkMode ? { background: currentTheme.gradient } : {}}
              >
                🌙 Sombre
              </button>
              <button 
                className={`mode-btn ${!isDarkMode ? 'active' : ''}`}
                onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                style={!isDarkMode ? { background: currentTheme.gradient } : {}}
              >
                ☀️ Clair
              </button>
            </div>
          </div>          <div className="theme-section">
            <h4>Couleur du thème</h4>
            <div className="color-options">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`color-option ${colorTheme === key ? 'active' : ''}`}
                  onClick={() => setColorTheme(key)}
                  style={{ background: theme.gradient }}
                  title={theme.name}
                >
                  {colorTheme === key && '✓'}
                </button>
              ))}
            </div>
          </div>          <button className="theme-close-btn" onClick={() => setIsOpen(false)}>
            Fermer
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};export default ThemeSelector;
