// Web Audio API ambient nostalgic street bell/chime synthesizer
let audioCtx: AudioContext | null = null;
let isPlaying = false;
let intervalId: number | null = null;

export const toggleStreetAmbiance = (onStateChange: (active: boolean) => void) => {
  if (isPlaying) {
    if (intervalId) window.clearInterval(intervalId);
    isPlaying = false;
    onStateChange(false);
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    onStateChange(true);

    const playGentleTone = (freq: number, duration: number, gainVal: number) => {
      if (!audioCtx || audioCtx.state === 'closed') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    };

    // Play a gentle pentatonic chime (Vietnamese traditional scale: Do - Re - Fa - Sol - La)
    const notes = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];
    const triggerChime = () => {
      if (!isPlaying) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      playGentleTone(note, 2.5, 0.025);
    };

    // First tone
    triggerChime();
    intervalId = window.setInterval(triggerChime, 3800);
  } catch {
    isPlaying = false;
    onStateChange(false);
  }
};
