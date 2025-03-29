import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';
import useLongPress from '../hooks/useLongPress';

interface DeviceButtonsProps {
  deviceType: 'phone' | 'tablet';
  bootState: 'booting' | 'locked' | 'unlocked' | 'off';
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onShortPowerPress: () => void;
  onLongPowerPress: () => void;
}

const DeviceButtons: React.FC<DeviceButtonsProps> = ({
  deviceType,
  bootState,
  onVolumeUp,
  onVolumeDown,
  onShortPowerPress,
  onLongPowerPress
}) => {
  const { triggerVolumeUIShow } = useSettings();
  const { playSound } = useSound();
  
  // Volume long press handling with interval for continuous adjustment
  const volumeTimerRef = useRef<number | null>(null);
  const volumeInitialDelayRef = useRef<number | null>(null);
  
  const startVolumeChange = (direction: 'up' | 'down') => {
    if (bootState === 'off') return;
    
    // Play click sound
    playSound('/sounds/click.mp3', 0.4);
    
    // Clear any existing timers
    stopVolumeChange();
    
    // Initial volume change immediately
    if (direction === 'up') {
      onVolumeUp();
    } else {
      onVolumeDown();
    }
    
    // Set a delay before starting the interval
    volumeInitialDelayRef.current = window.setTimeout(() => {
      // Start the interval for repeated volume changes
      volumeTimerRef.current = window.setInterval(() => {
        // Perform volume change
        if (direction === 'up') {
          onVolumeUp();
        } else {
          onVolumeDown();
        }
        
        // Keep the volume UI visible
        triggerVolumeUIShow();
      }, 150); // Interval of 150ms for repeat
    }, 400); // 400ms delay before starting repeat
  };
  
  const stopVolumeChange = () => {
    // Clear the initial delay if it exists
    if (volumeInitialDelayRef.current !== null) {
      window.clearTimeout(volumeInitialDelayRef.current);
      volumeInitialDelayRef.current = null;
    }
    
    // Clear the interval if it exists
    if (volumeTimerRef.current !== null) {
      window.clearInterval(volumeTimerRef.current);
      volumeTimerRef.current = null;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopVolumeChange();
    };
  }, []);
  
  // Power button long press handler
  const powerButtonLongPressHandler = useLongPress({
    onLongPress: () => {
      // Only trigger long press if device is not powered off
      if (bootState !== 'off') {
        onLongPowerPress();
      }
    },
    onStart: () => {},
    onCancel: () => {},
    threshold: 600
  });
  
  // Handle power button click
  const handlePowerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bootState === 'off') {
      // If device is off, power it on (this should be handled by parent)
      onShortPowerPress();
    } else {
      // If device is on, handle short press
      onShortPowerPress();
    }
  };

  return deviceType === 'phone' ? (
    /* Phone mode buttons - on right side of device */
    <>
      <button 
        id="volume-up-button"
        aria-label="Volume Up"
        className="device-button phone-button-volume-up"
        onClick={onVolumeUp}
        onMouseDown={() => startVolumeChange('up')}
        onMouseUp={stopVolumeChange}
        onMouseLeave={stopVolumeChange}
        onTouchStart={() => startVolumeChange('up')}
        onTouchEnd={stopVolumeChange}
      ></button>
      
      <button 
        id="volume-down-button"
        aria-label="Volume Down"
        className="device-button phone-button-volume-down"
        onClick={onVolumeDown}
        onMouseDown={() => startVolumeChange('down')}
        onMouseUp={stopVolumeChange}
        onMouseLeave={stopVolumeChange}
        onTouchStart={() => startVolumeChange('down')}
        onTouchEnd={stopVolumeChange}
      ></button>
      
      <button 
        id="power-button"
        aria-label="Power"
        className="device-button phone-button-power"
        onClick={handlePowerClick}
        {...powerButtonLongPressHandler}
      ></button>
    </>
  ) : (
    /* Tablet mode buttons - all buttons on top edge of device */
    <>
      <button 
        id="power-button"
        aria-label="Power"
        className="device-button tablet-button-power"
        onClick={handlePowerClick}
        {...powerButtonLongPressHandler}
      ></button>
      
      <button 
        id="volume-up-button"
        aria-label="Volume Up"
        className="device-button tablet-button-volume-up"
        onClick={onVolumeUp}
        onMouseDown={() => startVolumeChange('up')}
        onMouseUp={stopVolumeChange}
        onMouseLeave={stopVolumeChange}
        onTouchStart={() => startVolumeChange('up')}
        onTouchEnd={stopVolumeChange}
      ></button>
      
      <button 
        id="volume-down-button"
        aria-label="Volume Down"
        className="device-button tablet-button-volume-down"
        onClick={onVolumeDown}
        onMouseDown={() => startVolumeChange('down')}
        onMouseUp={stopVolumeChange}
        onMouseLeave={stopVolumeChange}
        onTouchStart={() => startVolumeChange('down')}
        onTouchEnd={stopVolumeChange}
      ></button>
    </>
  );
};

export default DeviceButtons; 