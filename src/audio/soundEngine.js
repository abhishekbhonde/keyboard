// Web Audio API Sound Engine for Mechanical Keyboard Sounds
// No external audio files needed — synthesizes sounds in real time

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Randomize a value within a range for organic feel
function randomize(base, range) {
    return base + (Math.random() - 0.5) * range;
}

// Sound profiles
const profiles = {
    clicky: {
        // Cherry MX Blue style — sharp click with two stages
        play(volume = 0.5) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Click down — sharp noise burst
            const bufferSize = ctx.sampleRate * 0.03;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
            }
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;

            // Bandpass filter for that "click" tone
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = randomize(4500, 1500);
            filter.Q.value = randomize(3, 1.5);

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(volume * randomize(0.8, 0.3), now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            noiseSource.start(now);
            noiseSource.stop(now + 0.06);

            // Bottom-out thock
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = randomize(180, 40);
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(volume * 0.25, now + 0.01);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start(now + 0.01);
            osc.stop(now + 0.08);
        },
    },

    tactile: {
        // Cherry MX Brown style — soft bump
        play(volume = 0.5) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const bufferSize = ctx.sampleRate * 0.04;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = randomize(2800, 800);
            filter.Q.value = randomize(1.5, 0.5);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(volume * randomize(0.55, 0.15), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            src.stop(now + 0.07);

            // Deeper thock
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = randomize(140, 30);
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(volume * 0.3, now + 0.005);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start(now + 0.005);
            osc.stop(now + 0.1);
        },
    },

    linear: {
        // Cherry MX Red style — smooth, quiet bottom-out
        play(volume = 0.5) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const bufferSize = ctx.sampleRate * 0.025;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = randomize(2000, 500);
            filter.Q.value = 0.7;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(volume * randomize(0.35, 0.1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(now);
            src.stop(now + 0.05);

            // Very soft thock
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = randomize(120, 20);
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(volume * 0.15, now + 0.003);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start(now + 0.003);
            osc.stop(now + 0.06);
        },
    },
};

export function playKeySound(profile = 'clicky', volume = 0.5) {
    const soundProfile = profiles[profile];
    if (soundProfile) {
        soundProfile.play(volume);
    }
}

export const soundProfiles = Object.keys(profiles);
