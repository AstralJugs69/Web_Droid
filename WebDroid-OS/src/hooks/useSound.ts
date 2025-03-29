import { useSettings } from '../contexts/SettingsContext';
import { 
  getAudioContext,
  generateClickSound,
  generateConfirmSound,
  generateErrorSound,
  generateUnlockSound,
  generatePlayerShootSound,
  generateExplosionSound,
  generateHitSound,
  generatePowerupSound,
  generateShutterSound,
  generateGameOverSound
} from '../utils/soundSynth';

// Map of sound type to generator function
type SoundGeneratorMap = {
  [key: string]: (ctx: AudioContext, volume?: number) => Promise<void>;
};

const soundGenerators: SoundGeneratorMap = {
  'click': generateClickSound,
  'confirm': generateConfirmSound,
  'error': generateErrorSound,
  'unlock': generateUnlockSound,
  'shoot': generatePlayerShootSound,
  'explosion': generateExplosionSound,
  'hit': generateHitSound,
  'powerup': generatePowerupSound,
  'shutter': generateShutterSound,
  'game_over': generateGameOverSound
};

export function useSound() {
  const { isSoundEnabled } = useSettings();

  const playSound = (soundType: string, volume = 0.5) => {
    // Don't play sound if sound is disabled in settings
    if (!isSoundEnabled) return;
    
    try {
      // Extract the sound type from the path (if it's still a path)
      let soundName = soundType;
      
      // Handle legacy format with paths like '/sounds/click.mp3'
      if (soundType.includes('/')) {
        // Extract the filename without extension from the path
        const match = soundType.match(/\/([^/]+)\.[^.]+$/);
        if (match && match[1]) {
          soundName = match[1];
        }
      }
      
      // Get the audio context
      const { ctx } = getAudioContext();
      
      // Find the appropriate sound generator
      const generator = soundGenerators[soundName];
      
      if (generator) {
        // Generate and play the sound (volume control is now handled by master gain)
        generator(ctx, volume).catch(error => {
          console.error(`Error generating sound ${soundName}:`, error);
        });
      } else {
        console.warn(`Unknown sound type: ${soundName}`);
      }
    } catch (error) {
      console.error(`Error playing sound ${soundType}:`, error);
    }
  };

  return { playSound };
} 