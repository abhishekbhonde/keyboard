// Web Speech API Voice Engine
// Provides Text-to-Speech (TTS) for key presses

let currentUtterance = null;

/**
 * Speaks the given text using the browser's Web Speech API.
 * @param {string} text - The text to speak.
 * @param {number} volume - Volume (0 to 1).
 * @param {number} rate - Speed of speech (0.1 to 10).
 */
export function speakEffect(text, volume = 0.5, rate = 1.2) {
    if (!window.speechSynthesis) return;

    // Stop any current speech to prioritize the latest key press
    window.speechSynthesis.cancel();

    // Map special key labels to more natural spoken words

    // Map special key labels to more natural spoken words
    const spokenMap = {
        '←': 'Backspace',
        'Enter': 'Return',
        ' ': 'Space',
        '◐': 'Theme toggle',
        '▲': 'Up',
        '▼': 'Down',
        '◄': 'Left',
        '►': 'Right',
        '⌘': 'Command',
        '⌥': 'Option',
        '⌃': 'Control',
        '⇧': 'Shift',
    };

    const textToSpeak = spokenMap[text] || text;

    currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance.volume = volume;
    currentUtterance.rate = rate;
    currentUtterance.pitch = 1.0;

    window.speechSynthesis.speak(currentUtterance);
}

export function stopSpeech() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
