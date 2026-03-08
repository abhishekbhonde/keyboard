import { soundProfiles } from '../audio/soundEngine';
import './Controls.css';

export default function Controls({
    soundProfile,
    setSoundProfile,
    volume,
    setVolume,
    theme,
    setTheme,
    voiceEnabled,
    setVoiceEnabled,
}) {
    return (
        <div className="controls">
            <div className="controls__group">
                <label className="controls__label">Switch Type</label>
                <div className="controls__switches">
                    {soundProfiles.map((profile) => (
                        <button
                            key={profile}
                            className={`controls__switch-btn ${soundProfile === profile ? 'controls__switch-btn--active' : ''
                                }`}
                            onClick={() => setSoundProfile(profile)}
                        >
                            <span className="controls__switch-dot" />
                            {profile.charAt(0).toUpperCase() + profile.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="controls__group">
                <label className="controls__label">Volume</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="controls__slider"
                />
            </div>

            <div className="controls__group">
                <label className="controls__label">Theme</label>
                <div className="controls__theme-toggle">
                    <button
                        className={`controls__theme-btn ${theme === 'light' ? 'controls__theme-btn--active' : ''}`}
                        onClick={() => setTheme('light')}
                    >
                        ☀️
                    </button>
                    <button
                        className={`controls__theme-btn ${theme === 'dark' ? 'controls__theme-btn--active' : ''}`}
                        onClick={() => setTheme('dark')}
                    >
                        🌙
                    </button>
                </div>
            </div>

            <div className="controls__group">
                <label className="controls__label">Voice Feedback</label>
                <button
                    className={`controls__voice-btn ${voiceEnabled ? 'controls__voice-btn--active' : ''}`}
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                    {voiceEnabled ? '🔊 On' : '🔇 Off'}
                </button>
            </div>
        </div>
    );
}
