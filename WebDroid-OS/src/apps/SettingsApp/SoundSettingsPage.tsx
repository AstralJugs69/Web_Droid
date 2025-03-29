import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSound } from '../../hooks/useSound';

const SoundSettingsPage: React.FC = () => {
  const { 
    isSoundEnabled, toggleSound,
    volumeLevel, setVolumeLevel,
    isMuted, toggleMute
  } = useSettings();
  const { playSound } = useSound();

  // Display volume as percentage
  const [displayVolume, setDisplayVolume] = useState(Math.round(volumeLevel * 100));

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDisplayVolume(value);
  };

  const handleVolumeChangeEnd = () => {
    setVolumeLevel(displayVolume / 100);
    playSound('click', 0.2);
  };

  // Update display volume when volume level changes
  useEffect(() => {
    setDisplayVolume(Math.round(volumeLevel * 100));
  }, [volumeLevel]);

  return (
    <div className="divide-y divide-outline-variant/10">
      {/* Sound Settings */}
      <div className="py-2">
        <div className="px-4 py-3">
          <h2 className="text-xs uppercase font-bold tracking-wide text-secondary/70 font-sans">Sound</h2>
        </div>

        {/* Sound Enabled Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-4 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
            <span className="font-medium text-on-surface font-sans">Sound Effects</span>
          </div>
          <ToggleSwitch 
            checked={isSoundEnabled}
            onChange={toggleSound}
          />
        </div>

        {/* Mute Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-4 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                {isMuted ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                )}
              </svg>
            </div>
            <span className="font-medium text-on-surface font-sans">Mute</span>
          </div>
          <ToggleSwitch 
            checked={isMuted}
            onChange={toggleMute}
          />
        </div>
        
        {/* Volume Slider */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="volume-slider" className="block text-sm font-medium text-on-surface font-sans">Volume</label>
            <span className="text-sm text-on-surface-variant font-sans">{displayVolume}%</span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={displayVolume}
            onChange={handleVolumeChange}
            onMouseUp={handleVolumeChangeEnd}
            onTouchEnd={handleVolumeChangeEnd}
            className="w-full h-2 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
      
      {/* Sound Test Section */}
      <div className="py-2">
        <div className="px-4 py-3">
          <h2 className="text-xs uppercase font-bold tracking-wide text-secondary/70 font-sans">Test Sounds</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2 px-4 py-2">
          <button 
            onClick={() => playSound('click')}
            className="p-2 border border-outline-variant rounded-btn text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant/70 font-sans"
          >
            Click
          </button>
          <button 
            onClick={() => playSound('unlock')}
            className="p-2 border border-outline-variant rounded-btn text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant/70 font-sans"
          >
            Unlock
          </button>
          <button 
            onClick={() => playSound('error')}
            className="p-2 border border-outline-variant rounded-btn text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant/70 font-sans"
          >
            Error
          </button>
          <button 
            onClick={() => playSound('notification')}
            className="p-2 border border-outline-variant rounded-btn text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant/70 font-sans"
          >
            Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundSettingsPage; 