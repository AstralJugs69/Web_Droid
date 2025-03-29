/**
 * Sound synthesis module using Web Audio API
 * Generates programmatic sound effects for UI and game interactions
 */

// Singleton AudioContext instance
let audioContextInstance: AudioContext | null = null;
// Master gain node for global volume control
let masterGainNode: GainNode | null = null;

/**
 * Get or create the AudioContext singleton
 */
export function getAudioContext(): { ctx: AudioContext, masterGain: GainNode } {
  if (!audioContextInstance) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported in this browser');
      }
      audioContextInstance = new AudioContextClass();
      
      // Create master gain node
      masterGainNode = audioContextInstance.createGain();
      masterGainNode.gain.value = 1.0; // Default to full volume
      masterGainNode.connect(audioContextInstance.destination);
      
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      // Create dummy audio context that does nothing as fallback
      audioContextInstance = {
        createOscillator: () => ({ connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, addEventListener: () => {}, type: '' }),
        createGain: () => ({ connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }),
        currentTime: 0,
        destination: null,
      } as unknown as AudioContext;
      
      // Create dummy master gain node
      masterGainNode = {
        gain: { value: 1.0, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
        connect: () => {},
      } as unknown as GainNode;
    }
  }
  
  return { 
    ctx: audioContextInstance,
    masterGain: masterGainNode!
  };
}

/**
 * Set the master volume level for all audio output
 * @param level Volume level from 0-100
 * @param isMuted Whether audio is muted
 */
export function setMasterVolume(level: number, isMuted: boolean = false): void {
  const { ctx, masterGain } = getAudioContext();
  
  // If muted, set gain to 0 regardless of level
  if (isMuted) {
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
    return;
  }
  
  // Convert 0-100 scale to 0-1 for gain value
  const gainValue = level / 100;
  
  // Apply volume change with a small ramp for smoothness
  masterGain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + 0.05);
}

/**
 * Generates a short click sound
 * Uses a triangle wave for a clean, crisp click
 */
export async function generateClickSound(
  ctx: AudioContext,
  volume = 0.25, 
  frequency = 1200, 
  duration = 0.03
): Promise<void> {
  const { masterGain } = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure oscillator - using triangle for a softer click
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Configure gain envelope - very fast attack and decay
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Connect to master gain instead of destination
  osc.connect(gainNode);
  gainNode.connect(masterGain);
  
  // Play and handle cleanup
  return new Promise((resolve) => {
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    
    osc.addEventListener('ended', () => {
      osc.disconnect();
      gainNode.disconnect();
      resolve();
    });
  });
}

/**
 * Generates a confirmation sound effect
 * Uses a rising major third interval (musical)
 */
export async function generateConfirmSound(
  ctx: AudioContext,
  volume = 0.35, 
  freq1 = 523.25, // C5
  freq2 = 659.25, // E5
  duration = 0.15
): Promise<void> {
  const { masterGain } = getAudioContext();
  // Create two oscillators for a richer sound
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure first oscillator - base note
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
  
  // Configure second oscillator - higher note with slight delay
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq2, ctx.currentTime + 0.05);
  
  // Configure gain envelope - gradual rise and fall
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
  gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration * 0.7);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Connect to master gain instead of destination
  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(masterGain);
  
  // Play and handle cleanup
  return new Promise((resolve) => {
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.05); // Slight delay for second note
    
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
    
    osc1.addEventListener('ended', () => {
      osc1.disconnect();
      osc2.disconnect();
      gainNode.disconnect();
      resolve();
    });
  });
}

/**
 * Generates an error sound effect
 * Uses a descending sawtooth wave for a harsh, alerting sound
 */
export async function generateErrorSound(
  ctx: AudioContext,
  volume = 0.3, 
  frequency = 220, 
  duration = 0.25
): Promise<void> {
  const { masterGain } = getAudioContext();
  // Create two oscillators for a richer sound
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure oscillators
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);
  
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(frequency * 1.0, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);
  
  // Configure gain envelope - quick attack, slower decay
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + duration * 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Create filter for more defined sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(frequency * 3, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + duration);
  filter.Q.value = 2;
  
  // Connect to master gain instead of destination
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);
  
  // Play and handle cleanup
  return new Promise((resolve) => {
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
    
    osc1.addEventListener('ended', () => {
      osc1.disconnect();
      osc2.disconnect();
      filter.disconnect();
      gainNode.disconnect();
      resolve();
    });
  });
}

/**
 * Generates an unlock sound effect (rising arpeggio)
 * Uses a C major triad arpeggio (C5-E5-G5)
 */
export async function generateUnlockSound(
  ctx: AudioContext,
  volume = 0.4, 
  freq1 = 523.25, // C5
  freq2 = 659.25, // E5
  freq3 = 783.99, // G5
  duration = 0.07
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // C5-E5-G5 arpeggio
  const playNote = async (freq: number, time: number, noteVolume: number, noteType: OscillatorType = 'sine'): Promise<void> => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = noteType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
    gainNode.gain.linearRampToValueAtTime(noteVolume, ctx.currentTime + time + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + duration);
    
    return new Promise((resolve) => {
      osc.addEventListener('ended', () => {
        osc.disconnect();
        gainNode.disconnect();
        resolve();
      });
    });
  };
  
  // Play three notes in quick succession with different oscillator types
  await Promise.all([
    playNote(freq1, 0, volume * 0.7, 'sine'),
    playNote(freq2, duration * 0.6, volume * 0.8, 'triangle'),
    playNote(freq3, duration * 1.2, volume, 'sine')
  ]);
}

/**
 * Generates a player shoot sound effect
 * Uses a short square wave with frequency drop
 */
export async function generatePlayerShootSound(
  ctx: AudioContext,
  volume = 0.15, 
  freq = 580, 
  duration = 0.04
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // Create a quick square wave pulse with noise
  const osc = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  const gainNode = ctx.createGain();
  
  // Configure main oscillator
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);
  
  // Create noise for texture
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Fill with filtered noise
  for (let i = 0; i < bufferSize; i++) {
    // Less noise as time progresses
    const noiseFactor = 1 - (i / bufferSize);
    data[i] = (Math.random() * 2 - 1) * noiseFactor * 0.3;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  // Configure main gain
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Configure noise gain (quieter)
  noiseGain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Connect to master gain instead of destination
  osc.connect(gainNode);
  noise.connect(noiseGain);
  noiseGain.connect(masterGain);
  gainNode.connect(masterGain);
  
  return new Promise((resolve) => {
    osc.start(ctx.currentTime);
    noise.start(ctx.currentTime);
    
    osc.stop(ctx.currentTime + duration);
    noise.stop(ctx.currentTime + duration);
    
    osc.addEventListener('ended', () => {
      osc.disconnect();
      noise.disconnect();
      gainNode.disconnect();
      noiseGain.disconnect();
      resolve();
    });
  });
}

/**
 * Generates an explosion sound effect
 * Uses filtered noise with low-pass filter sweep
 */
export async function generateExplosionSound(
  ctx: AudioContext,
  volume = 0.6, 
  duration = 0.6
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // Create multiple components for a rich explosion
  
  // 1. Noise component (main body of explosion)
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Fill with shaped noise (more energy at start)
  for (let i = 0; i < bufferSize; i++) {
    const progress = i / bufferSize;
    // More energy at the beginning, tapering off
    const energyFactor = Math.pow(1 - progress, 1.5);
    data[i] = (Math.random() * 2 - 1) * energyFactor;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  // 2. Initial impact oscillator (thump)
  const thumpOsc = ctx.createOscillator();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(100, ctx.currentTime);
  thumpOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
  
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
  // 3. Create filters for the boom effect
  // Low-pass filter for rumble
  const lowpassFilter = ctx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.frequency.setValueAtTime(1000, ctx.currentTime);
  lowpassFilter.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + duration);
  
  // Bandpass filter for body
  const bandpassFilter = ctx.createBiquadFilter();
  bandpassFilter.type = 'bandpass';
  bandpassFilter.frequency.setValueAtTime(250, ctx.currentTime);
  bandpassFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration * 0.5);
  bandpassFilter.Q.value = 1.0;
  
  // Create gain nodes for volume envelope
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
  noiseGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Connect to master gain instead of destination
  noise.connect(lowpassFilter);
  noise.connect(bandpassFilter);
  lowpassFilter.connect(noiseGain);
  bandpassFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  
  thumpOsc.connect(thumpGain);
  thumpGain.connect(masterGain);
  
  return new Promise((resolve) => {
    noise.start(ctx.currentTime);
    thumpOsc.start(ctx.currentTime);
    
    noise.stop(ctx.currentTime + duration);
    thumpOsc.stop(ctx.currentTime + 0.15);
    
    noise.addEventListener('ended', () => {
      noise.disconnect();
      lowpassFilter.disconnect();
      bandpassFilter.disconnect();
      noiseGain.disconnect();
      thumpOsc.disconnect();
      thumpGain.disconnect();
      resolve();
    });
  });
}

/**
 * Generates a hit sound effect
 * Crisp impact sound with decay
 */
export async function generateHitSound(
  ctx: AudioContext,
  volume = 0.4, 
  freq = 350, 
  duration = 0.08
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // Main impact oscillator
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Use triangle for impact
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);
  
  // Secondary oscillator for texture
  const osc2 = ctx.createOscillator();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(freq * 0.8, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + duration * 0.7);
  
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.5);
  
  // Configure main gain envelope - very fast attack, medium decay
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Connect to master gain instead of destination
  osc.connect(gainNode);
  osc2.connect(gain2);
  gainNode.connect(masterGain);
  gain2.connect(masterGain);
  
  return new Promise((resolve) => {
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    
    osc.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
    
    osc.addEventListener('ended', () => {
      osc.disconnect();
      osc2.disconnect();
      gainNode.disconnect();
      gain2.disconnect();
      resolve();
    });
  });
}

/**
 * Generates a powerup sound effect
 * Rising musical interval with harmonics
 */
export async function generatePowerupSound(
  ctx: AudioContext,
  volume = 0.5, 
  freq1 = 523.25, // C5
  freq2 = 783.99, // G5
  duration = 0.2
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // Main oscillator - sweeping frequency
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure main oscillator
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq1, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(freq2, ctx.currentTime + duration * 0.9);
  
  // Secondary oscillator for brightness (one octave up)
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq1 * 2, ctx.currentTime + 0.05);
  osc2.frequency.linearRampToValueAtTime(freq2 * 2, ctx.currentTime + duration * 0.9);
  
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.05);
  gain2.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Configure main gain envelope - gradual swell then decay
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + duration * 0.6);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 1.2);
  
  // Add a shimmer effect at the end
  const shimmerOsc = ctx.createOscillator();
  shimmerOsc.type = 'sine';
  shimmerOsc.frequency.setValueAtTime(freq2 * 1.5, ctx.currentTime + duration * 0.6);
  
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(0, ctx.currentTime + duration * 0.6);
  shimmerGain.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + duration * 0.7);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 1.1);
  
  // Connect to master gain instead of destination
  osc.connect(gainNode);
  osc2.connect(gain2);
  shimmerOsc.connect(shimmerGain);
  
  gainNode.connect(masterGain);
  gain2.connect(masterGain);
  shimmerGain.connect(masterGain);
  
  return new Promise((resolve) => {
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.05);
    shimmerOsc.start(ctx.currentTime + duration * 0.6);
    
    osc.stop(ctx.currentTime + duration * 1.2);
    osc2.stop(ctx.currentTime + duration * 1.2);
    shimmerOsc.stop(ctx.currentTime + duration * 1.1);
    
    osc.addEventListener('ended', () => {
      osc.disconnect();
      osc2.disconnect();
      shimmerOsc.disconnect();
      gainNode.disconnect();
      gain2.disconnect();
      shimmerGain.disconnect();
      resolve();
    });
  });
}

/**
 * Generates a camera shutter sound
 * Two-stage sound with click and mechanism components
 */
export async function generateShutterSound(
  ctx: AudioContext,
  volume = 0.5
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  // Very short click followed by mechanism sound
  const clickDuration = 0.01;
  const mechanismDuration = 0.12;
  
  // First click
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  
  clickOsc.type = 'square';
  clickOsc.frequency.setValueAtTime(5000, ctx.currentTime);
  
  clickGain.gain.setValueAtTime(0, ctx.currentTime);
  clickGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.001);
  clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + clickDuration);
  
  clickOsc.connect(clickGain);
  clickGain.connect(masterGain);
  
  // Secondary softer click after a tiny delay
  const click2Osc = ctx.createOscillator();
  const click2Gain = ctx.createGain();
  
  click2Osc.type = 'triangle';
  click2Osc.frequency.setValueAtTime(3000, ctx.currentTime + 0.01);
  
  click2Gain.gain.setValueAtTime(0, ctx.currentTime + 0.01);
  click2Gain.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + 0.015);
  click2Gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01 + clickDuration);
  
  click2Osc.connect(click2Gain);
  click2Gain.connect(masterGain);
  
  // Mechanism sound (filter sweep on noise)
  const bufferSize = ctx.sampleRate * mechanismDuration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Shaped noise with more at start, less at end
  for (let i = 0; i < bufferSize; i++) {
    const progress = i / bufferSize;
    const energyFactor = Math.pow(1 - progress, 1.2);
    data[i] = (Math.random() * 2 - 1) * energyFactor * 0.5;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  // Create bandpass filter for mechanism sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(4000, ctx.currentTime + clickDuration * 2);
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + clickDuration * 2 + mechanismDuration);
  filter.Q.value = 3; // Narrower bandwidth for more mechanical sound
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, ctx.currentTime + clickDuration * 2);
  noiseGain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + clickDuration * 2 + 0.01);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + clickDuration * 2 + mechanismDuration);
  
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(masterGain);
  
  // Play all sounds
  clickOsc.start(ctx.currentTime);
  clickOsc.stop(ctx.currentTime + clickDuration);
  
  click2Osc.start(ctx.currentTime + 0.01);
  click2Osc.stop(ctx.currentTime + 0.01 + clickDuration);
  
  noise.start(ctx.currentTime + clickDuration * 2);
  noise.stop(ctx.currentTime + clickDuration * 2 + mechanismDuration);
  
  return new Promise((resolve) => {
    noise.addEventListener('ended', () => {
      clickOsc.disconnect();
      clickGain.disconnect();
      click2Osc.disconnect();
      click2Gain.disconnect();
      noise.disconnect();
      filter.disconnect();
      noiseGain.disconnect();
      resolve();
    });
  });
}

/**
 * Generates a game over sound
 * Descending notes with reverb-like decay
 */
export async function generateGameOverSound(
  ctx: AudioContext,
  volume = 0.6
): Promise<void> {
  const { masterGain } = getAudioContext();
  
  const duration = 1.2;
  
  // Create a series of descending notes
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure oscillators
  // Main melody oscillator
  osc1.type = 'sine';
  
  // Frequency pattern for main oscillator (descending melody)
  osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
  osc1.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
  osc1.frequency.linearRampToValueAtTime(349.23, ctx.currentTime + 0.3); // F4
  osc1.frequency.setValueAtTime(349.23, ctx.currentTime + 0.4);
  osc1.frequency.linearRampToValueAtTime(293.66, ctx.currentTime + 0.6); // D4
  osc1.frequency.setValueAtTime(293.66, ctx.currentTime + 0.7);
  osc1.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 0.9); // C4
  
  // Second oscillator for harmonics
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(220, ctx.currentTime); // A3 (one octave lower)
  osc2.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
  osc2.frequency.linearRampToValueAtTime(174.61, ctx.currentTime + 0.35); // F3
  osc2.frequency.setValueAtTime(174.61, ctx.currentTime + 0.45);
  osc2.frequency.linearRampToValueAtTime(146.83, ctx.currentTime + 0.65); // D3
  osc2.frequency.setValueAtTime(146.83, ctx.currentTime + 0.75);
  osc2.frequency.linearRampToValueAtTime(130.81, ctx.currentTime + 0.95); // C3
  
  // Configure gain for osc2 (softer)
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Volume envelope - articulated for each note
  gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.25);
  
  gainNode.gain.linearRampToValueAtTime(volume * 0.8, ctx.currentTime + 0.35);
  gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.55);
  
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + 0.65);
  gainNode.gain.exponentialRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.85);
  
  gainNode.gain.linearRampToValueAtTime(volume * 0.6, ctx.currentTime + 0.95);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  // Create reverb-like effect with a short, filtered noise burst
  const reverbBuffer = ctx.createBuffer(2, ctx.sampleRate * 1.0, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = reverbBuffer.getChannelData(channel);
    for (let i = 0; i < reverbBuffer.length; i++) {
      // Exponential decay
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.5)) * 0.1;
    }
  }
  
  const reverbSource = ctx.createBufferSource();
  reverbSource.buffer = reverbBuffer;
  
  const reverbFilter = ctx.createBiquadFilter();
  reverbFilter.type = 'lowpass';
  reverbFilter.frequency.value = 1000;
  
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = volume * 0.1;
  
  // Connect to master gain instead of destination
  osc1.connect(gainNode);
  osc2.connect(gain2);
  reverbSource.connect(reverbFilter);
  reverbFilter.connect(reverbGain);
  
  gainNode.connect(masterGain);
  gain2.connect(masterGain);
  reverbGain.connect(masterGain);
  
  return new Promise((resolve) => {
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    reverbSource.start(ctx.currentTime + 0.1);
    
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
    reverbSource.stop(ctx.currentTime + duration);
    
    osc1.addEventListener('ended', () => {
      osc1.disconnect();
      osc2.disconnect();
      reverbSource.disconnect();
      gainNode.disconnect();
      gain2.disconnect();
      reverbFilter.disconnect();
      reverbGain.disconnect();
      resolve();
    });
  });
} 