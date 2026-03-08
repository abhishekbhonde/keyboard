import { useState, useCallback } from 'react';
import Keyboard from './components/Keyboard';
import Controls from './components/Controls';
import TypingTest from './components/TypingTest';
import './App.css';

function App() {
  const [soundProfile, setSoundProfile] = useState('clicky');
  const [volume, setVolume] = useState(0.6);
  const [theme, setTheme] = useState('dark');
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);

  return (
    <div className="app">
      <div className="app__bg-glow" />

      <aside className="app__sidebar">
        <div className="app__logo">
          <h1>Typing<span>Box</span></h1>
          <p>Master your keystrokes</p>
        </div>

        <Controls
          soundProfile={soundProfile}
          setSoundProfile={setSoundProfile}
          volume={volume}
          setVolume={setVolume}
          theme={theme}
          setTheme={setTheme}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
        />

        <div className="app__sidebar-footer">
          <p>Built with ❤️ by Abhishek</p>
        </div>
      </aside>

      <main className="app__main">
        <div className="app__content">
          <TypingTest />
          <div className="app__keyboard-container">
            <Keyboard
              soundProfile={soundProfile}
              volume={volume}
              onThemeToggle={toggleTheme}
              voiceEnabled={voiceEnabled}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
