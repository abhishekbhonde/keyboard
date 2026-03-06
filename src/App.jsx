import { useState, useCallback } from 'react';
import Keyboard from './components/Keyboard';
import Controls from './components/Controls';
import './App.css';

function App() {
  const [soundProfile, setSoundProfile] = useState('clicky');
  const [volume, setVolume] = useState(0.6);
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);

  return (
    <div className="app">
      <div className="app__bg-glow" />

      <div className="app__keyboard-wrapper">
        <Keyboard
          soundProfile={soundProfile}
          volume={volume}
          onThemeToggle={toggleTheme}
        />
      </div>

      <Controls
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        volume={volume}
        setVolume={setVolume}
        theme={theme}
        setTheme={setTheme}
      />

      <footer className="app__footer">
        <p>Built with ❤️ by Abhishek</p>
      </footer>
    </div>
  );
}

export default App;
