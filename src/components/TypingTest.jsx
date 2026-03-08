import { useState, useEffect, useCallback, useRef } from 'react';
import './TypingTest.css';

const TEXT_DATA = {
    easy: [
        "The sun is shining bright today. It is a good day to go for a long walk in the park. Maybe we can see some birds.",
        "Simple words are easy to type. Just keep your fingers on the home row and look at the screen while you type fast.",
        "I like to code in my free time. It is a very rewarding hobby that teaches me how to solve complex problems easily."
    ],
    medium: [
        "Mechanical keyboards provide a unique tactile experience that many enthusiasts crave. The sound of the switches is often called 'thock' by the community.",
        "Developing software requires a blend of creativity and logical thinking. You must be able to break down large problems into smaller, manageable chunks.",
        "JavaScript is a versatile language used for both front-end and back-end development. Its ecosystem is vast and constantly evolving with new libraries."
    ],
    hard: [
        "The juxtaposition of ancient traditions and modern technological advancements creates a fascinatng cultural landscape. Navigating such complexity requires deep insight.",
        "Cryptography is the practice and study of techniques for secure communication in the presence of adversarial behavior. It involves mathematical algorithms.",
        "Quantum computing leverages the principles of superposition and entanglement to perform calculations that would be impossible for classical computers."
    ]
};

const TIMER_OPTIONS = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '2m', value: 120 }
];

export default function TypingTest() {
    const [level, setLevel] = useState('medium');
    const [timerDuration, setTimerDuration] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [paragraph, setParagraph] = useState('');
    const [input, setInput] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Stats
    const [wpm, setWpm] = useState(0);
    const [rawWpm, setRawWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [totalCharsTyped, setTotalCharsTyped] = useState(0);

    const [isFinished, setIsFinished] = useState(false);
    const [bestScore, setBestScore] = useState(localStorage.getItem('bestWPM') || 0);
    const [scrollOffset, setScrollOffset] = useState(0);

    const inputRef = useRef(null);
    const displayRef = useRef(null);
    const activeCharRef = useRef(null);
    const timerRef = useRef(null);

    // Track stats in refs to avoid timer interval reseting on state changes
    const statsRef = useRef({ wpm: 0, rawWpm: 0, accuracy: 100, errors: 0, matches: 0 });

    const finishTest = useCallback(() => {
        setIsFinished(true);
        setIsActive(false);
        setBestScore((prev) => {
            const currentWPM = statsRef.current.wpm;
            if (currentWPM > prev) {
                localStorage.setItem('bestWPM', currentWPM);
                return currentWPM;
            }
            return prev;
        });
    }, []);

    // Initialize/Reset test
    useEffect(() => {
        resetTest();
    }, [level, timerDuration]);

    // Timer logic - STABLE VERSION
    useEffect(() => {
        const handleBlur = () => { if (isActive && !isFinished) setIsPaused(true); };
        const handleFocus = () => { if (isActive && !isFinished) setIsPaused(false); };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        if (isActive && !isFinished && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => {
            clearInterval(timerRef.current);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isActive, isFinished, isPaused, finishTest]);

    // Scroll logic
    useEffect(() => {
        if (activeCharRef.current && displayRef.current) {
            const activeChar = activeCharRef.current;
            const charTop = activeChar.offsetTop;
            const lineHeight = 40;
            if (charTop > lineHeight) {
                setScrollOffset(charTop - lineHeight);
            } else {
                setScrollOffset(0);
            }
        }
    }, [input]);

    const resetTest = useCallback(() => {
        const texts = TEXT_DATA[level];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setParagraph((randomText + " ").repeat(20).trim());
        setInput('');
        setTimeLeft(timerDuration);
        setIsActive(false);
        setIsPaused(false);
        setIsFinished(false);
        setScrollOffset(0);
        setWpm(0);
        setRawWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTotalCharsTyped(0);
        statsRef.current = { wpm: 0, rawWpm: 0, accuracy: 100, errors: 0, matches: 0 };
        if (timerRef.current) clearInterval(timerRef.current);
    }, [level, timerDuration]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (isFinished || isPaused) return;

        if (!isActive && value.length > 0) {
            setIsActive(true);
        }

        const isBackspace = value.length < input.length;
        if (!isBackspace) {
            const lastIdx = value.length - 1;
            if (value[lastIdx] !== paragraph[lastIdx]) {
                statsRef.current.errors += 1;
            }
            setTotalCharsTyped(prev => {
                const next = prev + 1;
                updateStats(value.length, next);
                return next;
            });
        } else {
            updateStats(value.length, totalCharsTyped);
        }

        setInput(value);

        if (value.length >= paragraph.length) {
            finishTest();
        }
    };

    const updateStats = (charsLength, totalTyped) => {
        if (charsLength === 0) {
            setAccuracy(100);
            return;
        }

        let matches = 0;
        for (let i = 0; i < charsLength; i++) {
            if (input[i] === paragraph[i] || (i === charsLength - 1 && inputRef.current.value[i] === paragraph[i])) {
                // This is a bit tricky because state hasn't updated yet for 'input'
            }
        }

        // Simpler: recalculate matches based on current value being typed
        const currentValue = inputRef.current.value;
        let currentMatches = 0;
        for (let i = 0; i < currentValue.length; i++) {
            if (currentValue[i] === paragraph[i]) currentMatches++;
        }

        const newAccuracy = Math.round((currentMatches / currentValue.length) * 100);
        setAccuracy(newAccuracy);

        const timeElapsed = (timerDuration - timeLeft) || 1;
        const minutes = timeElapsed / 60;

        const newRawWpm = Math.round((totalTyped / 5) / minutes);
        const newNetWpm = Math.round((currentMatches / 5) / minutes);

        setRawWpm(newRawWpm);
        setWpm(newNetWpm);
        setErrors(statsRef.current.errors);

        statsRef.current.wpm = newNetWpm;
        statsRef.current.rawWpm = newRawWpm;
        statsRef.current.accuracy = newAccuracy;
    };

    const getRank = (wpmValue) => {
        if (wpmValue >= 100) return { label: 'Legendary', color: '#ffcc00' };
        if (wpmValue >= 80) return { label: 'Pro', color: '#ff4444' };
        if (wpmValue >= 60) return { label: 'Advanced', color: '#00ccff' };
        if (wpmValue >= 40) return { label: 'Intermediate', color: '#00ff88' };
        return { label: 'Novice', color: '#aaaaaa' };
    };

    const words = paragraph.split(' ');
    const inputWords = input.split(' ');
    const currentWordIndex = inputWords.length - 1;

    const renderText = () => {
        let charCounter = 0;
        return words.map((word, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            const wordWithSpace = word + (wIdx === words.length - 1 ? '' : ' ');
            return (
                <span key={wIdx} className={`typing-test__word ${isCurrent ? 'typing-test__word--current' : ''}`}>
                    {wordWithSpace.split('').map((char, cIdx) => {
                        const globalIdx = charCounter++;
                        let status = '';
                        if (globalIdx < input.length) {
                            status = input[globalIdx] === paragraph[globalIdx] ? 'correct' : 'incorrect';
                        }
                        const isActiveChar = globalIdx === input.length;
                        return (
                            <span key={cIdx} ref={isActiveChar ? activeCharRef : null}
                                className={`typing-test__char ${status ? `typing-test__char--${status}` : ''} ${isActiveChar ? 'typing-test__char--active' : ''}`}>
                                {char}
                            </span>
                        );
                    })}
                </span>
            );
        });
    };

    return (
        <div className="typing-test">
            {isPaused && !isFinished && (
                <div className="typing-test__pause-overlay" onClick={() => { setIsPaused(false); inputRef.current?.focus(); }}>
                    <div className="typing-test__pause-content">
                        <h2>PAUSED</h2>
                        <p>Click here to resume</p>
                    </div>
                </div>
            )}
            <div className="typing-test__header">
                <div className="typing-test__options">
                    <div className="typing-test__group">
                        <span className="typing-test__group-label">Difficulty</span>
                        <div className="typing-test__levels">
                            {['easy', 'medium', 'hard'].map(l => (
                                <button key={l} className={`typing-test__opt-btn ${level === l ? 'typing-test__opt-btn--active' : ''}`}
                                    onClick={() => setLevel(l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</button>
                            ))}
                        </div>
                    </div>
                    <div className="typing-test__group">
                        <span className="typing-test__group-label">Duration</span>
                        <div className="typing-test__timers">
                            {TIMER_OPTIONS.map(opt => (
                                <button key={opt.value} className={`typing-test__opt-btn ${timerDuration === opt.value ? 'typing-test__opt-btn--active' : ''}`}
                                    onClick={() => setTimerDuration(opt.value)}>{opt.label}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="typing-test__best">Best: <span>{bestScore} WPM</span></div>
            </div>
            <div className="typing-test__stats">
                <div className="typing-test__stat"><span className="typing-test__stat-label">Time</span><span className="typing-test__stat-value">{timeLeft}s</span></div>
                <div className="typing-test__stat"><span className="typing-test__stat-label">WPM</span><span className="typing-test__stat-value">{wpm}</span></div>
                <div className="typing-test__stat"><span className="typing-test__stat-label">Accuracy</span><span className="typing-test__stat-value">{accuracy}%</span></div>
                <button className="typing-test__restart" onClick={resetTest}>↻ Restart</button>
            </div>
            <div className="typing-test__display-container">
                <div className="typing-test__display" ref={displayRef} onClick={() => inputRef.current?.focus()} style={{ transform: `translateY(-${scrollOffset}px)` }}>
                    {renderText()}
                </div>
            </div>
            <input ref={inputRef} type="text" className="typing-test__input" value={input} onChange={handleInputChange} autoFocus />
            {isFinished && (
                <div className="typing-test__celebration">
                    <div className="typing-test__results-card">
                        <h2>Speed Result</h2>
                        <div className="typing-test__results-grid">
                            <div className="typing-test__result-item"><span className="typing-test__result-label">Net WPM</span><span className="typing-test__result-value">{wpm}</span></div>
                            <div className="typing-test__result-item"><span className="typing-test__result-label">Accuracy</span><span className="typing-test__result-value">{accuracy}%</span></div>
                            <div className="typing-test__result-item"><span className="typing-test__result-label">Raw WPM</span><span className="typing-test__result-value" style={{ opacity: 0.6 }}>{rawWpm}</span></div>
                            <div className="typing-test__result-item"><span className="typing-test__result-label">Errors</span><span className="typing-test__result-value" style={{ color: '#ff5555' }}>{errors}</span></div>
                        </div>
                        <div className="typing-test__rank"><span className="typing-test__rank-label">Typing Rank</span><span className="typing-test__rank-value" style={{ color: getRank(wpm).color }}>{getRank(wpm).label}</span></div>
                        <button className="typing-test__try-again" onClick={resetTest}>Back to start</button>
                    </div>
                </div>
            )}
        </div>
    );
}
