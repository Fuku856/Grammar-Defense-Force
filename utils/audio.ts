// Simple synth for 8-bit sounds
class AudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  
  // BGM State
  private bgmInterval: number | null = null;
  private bgmNoteIndex: number = 0;

  constructor() {
    // Safety check for SSR/Build environments where window is undefined
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContext();
        }
      } catch (e) {
        console.error("Audio API not supported");
      }
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        // If we resumed and BGM was supposed to be playing (interval set), it will now become audible.
      });
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Handle BGM mute state immediate effect
    if (this.isMuted) {
      this.stopBGM();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return this.isMuted;
  }

  public speak(text: string) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel current speech to avoid queue buildup and lag
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Ensure English pronunciation
    utterance.rate = 1.0;     // Normal speed
    utterance.pitch = 1.0;    // Normal pitch
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- BGM Logic ---

  public stopBGM() {
    if (this.bgmInterval) {
      if (typeof window !== 'undefined') {
        window.clearInterval(this.bgmInterval);
      }
      this.bgmInterval = null;
    }
  }

  public playMenuBGM() {
    // Prevent multiple loops
    if (this.bgmInterval) return;
    if (!this.ctx) return;
    if (typeof window === 'undefined') return;

    this.bgmNoteIndex = 0;
    
    // "Thinking" / "Preparation" Arpeggio Theme
    // C Minor: C, Eb, G, Bb
    // Pattern: Up and down arpeggios with a driving bass
    const arpSequence = [
      // Bar 1: Cm
      261.63, 311.13, 392.00, 523.25, // C4 Eb4 G4 C5
      392.00, 311.13, 261.63, 196.00, // G4 Eb4 C4 G3
      // Bar 2: Bb Major (relative)
      233.08, 293.66, 349.23, 466.16, // Bb3 D4 F4 Bb4
      349.23, 293.66, 233.08, 174.61, // F4 D4 Bb3 F3
    ];

    // Tempo
    const stepTime = 150; // ms

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const freq = arpSequence[this.bgmNoteIndex % arpSequence.length];

      // Lead Synth (Square for retro feel)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);
      
      // Short Pluck envelope
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

      // Bass Line (Plays every 4 steps = 1st beat of the "measure" in 16th notes context)
      if (this.bgmNoteIndex % 8 === 0) {
         const bassFreq = (this.bgmNoteIndex % 16 === 0) ? 65.41 : 58.27; // C2 then Bb1
         const bassOsc = this.ctx.createOscillator();
         const bassGain = this.ctx.createGain();
         bassOsc.type = 'triangle';
         bassOsc.frequency.setValueAtTime(bassFreq, now);
         bassGain.gain.setValueAtTime(0.15, now);
         bassGain.gain.linearRampToValueAtTime(0, now + 0.4);
         bassOsc.connect(bassGain);
         bassGain.connect(this.ctx.destination);
         bassOsc.start(now);
         bassOsc.stop(now + 0.4);
      }

      this.bgmNoteIndex++;
    }, stepTime);
  }

  // --- SFX ---

  public playShoot() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playExplosion() {
    if (!this.ctx || this.isMuted) return;

    const duration = 0.3;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration - 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  public playGameOverExplosion() {
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const duration = 2.0;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(10, t + 1.5); 

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, t); 
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(150, t);
    subOsc.frequency.exponentialRampToValueAtTime(20, t + 0.8);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start();
    subOsc.stop(t + 2.0);
  }

  public playHit() {
    this.playTone(150, 'sawtooth', 0.1, 0.1);
  }

  public playMiss() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  public playError() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public playStart() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  public playCountdownBeep() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playCountdownGo() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1760, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime); 
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export const audioController = new AudioController();