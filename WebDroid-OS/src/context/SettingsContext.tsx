import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';

export type DeviceType = 'phone' | 'tablet';

export interface SettingsContextType {
  deviceType: DeviceType;
  isCrtEffectEnabled: boolean;
  isSoundEnabled: boolean;
  volumeLevel: number;
  isMuted: boolean;
  showVolumeUI: boolean;
  brightnessLevel: number;
  
  setDeviceType: (type: DeviceType) => void;
  toggleCrtEffect: () => void;
  toggleSound: () => void;
  setVolumeLevel: (level: number) => void;
  setMuted: (muted: boolean) => void;
  setShowVolumeUI: (show: boolean) => void;
  setBrightnessLevel: (level: number) => void;
  
  // Other settings...
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Device and UI settings
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    const savedType = localStorage.getItem('deviceType');
    return savedType === 'tablet' ? 'tablet' : 'phone';
  });
  
  const [isCrtEffectEnabled, setIsCrtEffectEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('isCrtEffectEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Sound settings
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('isSoundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [volumeLevel, setVolumeLevelState] = useState<number>(() => {
    const saved = localStorage.getItem('volumeLevel');
    return saved ? parseInt(saved, 10) : 70;
  });
  
  const [isMuted, setMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('isMuted');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [showVolumeUI, setShowVolumeUI] = useState<boolean>(false);
  
  // Brightness setting
  const [brightnessLevel, setBrightnessLevelState] = useState<number>(() => {
    const saved = localStorage.getItem('brightnessLevel');
    return saved ? parseInt(saved, 10) : 80;
  });
  
  // Save device type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('deviceType', deviceType);
  }, [deviceType]);
  
  // Save CRT effect setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isCrtEffectEnabled', JSON.stringify(isCrtEffectEnabled));
  }, [isCrtEffectEnabled]);
  
  // Save sound setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isSoundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);
  
  // Save volume level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('volumeLevel', volumeLevel.toString());
  }, [volumeLevel]);
  
  // Save muted state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);
  
  // Save brightness level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('brightnessLevel', brightnessLevel.toString());
    
    // Here you could also implement actual brightness changes
    // For example, updating a CSS variable on the root element:
    document.documentElement.style.setProperty('--brightness-filter', `brightness(${brightnessLevel}%)`);
  }, [brightnessLevel]);
  
  // Handler for changing device type
  const handleSetDeviceType = (type: DeviceType) => {
    setDeviceType(type);
  };
  
  // Toggle CRT effect
  const handleToggleCrtEffect = () => {
    setIsCrtEffectEnabled(prev => !prev);
  };
  
  // Toggle sound
  const handleToggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };
  
  // Handler for changing volume level
  const handleSetVolumeLevel = (level: number) => {
    const clampedLevel = Math.max(0, Math.min(100, level));
    setVolumeLevelState(clampedLevel);
  };
  
  // Handler for changing brightness level
  const handleSetBrightnessLevel = (level: number) => {
    const clampedLevel = Math.max(10, Math.min(100, level));
    setBrightnessLevelState(clampedLevel);
  };
  
  return (
    <SettingsContext.Provider
      value={{
        deviceType,
        isCrtEffectEnabled,
        isSoundEnabled,
        volumeLevel,
        isMuted,
        showVolumeUI,
        brightnessLevel,
        
        setDeviceType: handleSetDeviceType,
        toggleCrtEffect: handleToggleCrtEffect,
        toggleSound: handleToggleSound,
        setVolumeLevel: handleSetVolumeLevel,
        setMuted,
        setShowVolumeUI,
        setBrightnessLevel: handleSetBrightnessLevel,
        
        // ... other settings ...
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 