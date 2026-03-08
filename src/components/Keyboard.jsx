import { useState, useEffect, useCallback, useRef } from 'react';
import Key from './Key';
import { keyboardLayout } from '../data/keyboardLayout';
import { playKeySound } from '../audio/soundEngine';
import { speakEffect } from '../audio/voiceEngine';
import './Keyboard.css';

export default function Keyboard({ soundProfile, volume, onThemeToggle, voiceEnabled }) {
    const [pressedKeys, setPressedKeys] = useState(new Set());
    const pressedPhysical = useRef(new Set());

    const handleKeyDown = useCallback((keyData) => {
        // Voice feedback first for minimum latency
        if (voiceEnabled) {
            speakEffect(keyData.label, volume);
        }

        playKeySound(soundProfile, volume);

        setPressedKeys((prev) => {
            const next = new Set(prev);
            next.add(keyData.id);
            return next;
        });

        if (keyData.action === 'theme') {
            onThemeToggle?.();
        }
    }, [soundProfile, volume, onThemeToggle, voiceEnabled]);

    const handleKeyUp = useCallback((keyData) => {
        setPressedKeys((prev) => {
            const next = new Set(prev);
            next.delete(keyData.id);
            return next;
        });
    }, []);

    // Physical keyboard listener
    useEffect(() => {
        const keyCodeToId = {};
        keyboardLayout.flat().forEach((key) => {
            if (key.keyCode && key.keyCode !== 'none') {
                keyCodeToId[key.keyCode] = key;
            }
        });

        const onPhysicalKeyDown = (e) => {
            const keyData = keyCodeToId[e.code];
            if (keyData && !pressedPhysical.current.has(e.code)) {
                // If an input is focused, let printable characters pass through
                const isInputActive = document.activeElement.tagName === 'INPUT' ||
                    document.activeElement.tagName === 'TEXTAREA';

                // Still prevent default for Tab and certain other system keys if needed,
                // but generally allow input for the typing test.
                if (!isInputActive || e.code === 'Tab') {
                    e.preventDefault();
                }

                pressedPhysical.current.add(e.code);
                handleKeyDown(keyData);
            }
        };

        const onPhysicalKeyUp = (e) => {
            const keyData = keyCodeToId[e.code];
            if (keyData) {
                pressedPhysical.current.delete(e.code);
                handleKeyUp(keyData);
            }
        };

        window.addEventListener('keydown', onPhysicalKeyDown);
        window.addEventListener('keyup', onPhysicalKeyUp);
        return () => {
            window.removeEventListener('keydown', onPhysicalKeyDown);
            window.removeEventListener('keyup', onPhysicalKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <div className="keyboard">
            <div className="keyboard__frame">
                {keyboardLayout.map((row, rowIndex) => (
                    <div className="keyboard__row" key={rowIndex}>
                        {row.map((keyData) => (
                            <Key
                                key={keyData.id}
                                keyData={keyData}
                                isPressed={pressedKeys.has(keyData.id)}
                                onKeyDown={handleKeyDown}
                                onKeyUp={handleKeyUp}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
