import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { setMasterVolume } from '../utils/soundSynth';

// Define the types of settings we're managing
type DeviceType = 'phone' | 'tablet';
type TemperatureUnit = 'celsius' | 'fahrenheit';
type NotesFontSize = 'sm' | 'base' | 'lg';
type NotesSortOrder = 'newest' | 'oldest';
type ColorMode = 'light' | 'dark';

// Define available themes
export const availableThemes = [
  { 
    id: 'default', 
    name: 'Default', 
    forcedMode: null as ColorMode | null,
    colors: ['#3b82f6', '#6b7280', '#f59e0b', '#f8fafc', '#ffffff']
  },
  { 
    id: 'material', 
    name: 'Material You', 
    forcedMode: null as ColorMode | null,
    colors: ['#a78bfa', '#8b5cf6', '#c4b5fd', '#f5f3ff', '#ffffff']
  },
  { 
    id: 'pixel', 
    name: 'Pixel', 
    forcedMode: null as ColorMode | null,
    colors: ['#2563eb', '#ef4444', '#eab308', '#22c55e', '#f8fafc']
  },
  { 
    id: 'synthwave', 
    name: 'Synthwave', 
    forcedMode: 'dark' as ColorMode,
    colors: ['#ec4899', '#8b5cf6', '#10b981', '#0f172a', '#1e293b']
  }
];

interface SettingsContextType {
  // Device type settings
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  
  // Sound settings
  isSoundEnabled: boolean;
  toggleSound: () => void;
  
  // Volume settings
  volumeLevel: number;
  setVolumeLevel: (level: number) => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  showVolumeUI: boolean;
  triggerVolumeUIShow: () => void;

  // Brightness settings
  brightnessLevel: number;
  setBrightnessLevel: (level: number) => void;

  // Security settings
  lockscreenPin: string | null;
  setLockscreenPin: (pin: string | null) => void;

  // Page Background settings (renamed from Wallpaper)
  activePageBgId: string;
  setActivePageBgId: (id: string) => void;

  // Weather app settings
  tempUnit: TemperatureUnit;
  setTempUnit: (unit: TemperatureUnit) => void;
  defaultWeatherLocation: string | null;
  setDefaultWeatherLocation: (location: string | null) => void;

  // Notes app settings
  notesFontSize: NotesFontSize;
  setNotesFontSize: (size: NotesFontSize) => void;
  notesSortOrder: NotesSortOrder;
  setNotesSortOrder: (order: NotesSortOrder) => void;

  // Theme settings
  activeThemeId: string;
  setActiveThemeId: (themeId: string) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  systemPrefersDark: boolean;
  currentMode: ColorMode; // Derived from activeThemeId, colorMode and systemPrefersDark
  
  // App navigation settings
  handleOpenApp: (appId: string) => void;
  
  // Power menu settings
  showPowerMenu: () => void;
  
  // Helper functions
  toggleColorMode: () => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component props
interface SettingsProviderProps {
  children: ReactNode;
}

// Provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Device type state
  const [deviceType, setDeviceTypeState] = useState<DeviceType>(() => {
    const savedDeviceType = localStorage.getItem('deviceType') as DeviceType | null;
    return savedDeviceType || 'phone';
  });
  
  // Sound state
  const [isSoundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const savedSetting = localStorage.getItem('sound');
    return savedSetting !== 'false'; // Default to true
  });
  
  // Volume state
  const [volumeLevel, setVolumeLevelState] = useState<number>(() => {
    const savedLevel = localStorage.getItem('volumeLevel');
    return savedLevel ? parseInt(savedLevel) / 100 : 0.5; // Default to 50%
  });
  
  // Brightness state
  const [brightnessLevel, setBrightnessLevelState] = useState<number>(() => {
    const savedLevel = localStorage.getItem('brightnessLevel');
    return savedLevel ? parseInt(savedLevel) : 80; // Default to 80%
  });
  
  // Mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedMuted = localStorage.getItem('isMuted');
    return savedMuted === 'true';
  });
  
  // Volume UI visibility state
  const [showVolumeUI, setShowVolumeUI] = useState<boolean>(false);
  
  // Page Background state (renamed from Wallpaper)
  const [activePageBgId, setActivePageBgIdState] = useState<string>(() => {
    const savedPageBgId = localStorage.getItem('activePageBg');
    return savedPageBgId || 'default'; // Default to 'default'
  });

  // Weather app settings
  const [tempUnit, setTempUnitState] = useState<TemperatureUnit>(() => {
    const savedUnit = localStorage.getItem('tempUnit') as TemperatureUnit | null;
    return savedUnit || 'celsius';
  });

  const [defaultWeatherLocation, setDefaultWeatherLocationState] = useState<string | null>(() => {
    const savedLocation = localStorage.getItem('defaultWeatherLocation');
    return savedLocation;
  });

  // Notes app settings
  const [notesFontSize, setNotesFontSizeState] = useState<NotesFontSize>(() => {
    const savedSize = localStorage.getItem('notesFontSize') as NotesFontSize | null;
    return savedSize || 'base';
  });

  const [notesSortOrder, setNotesSortOrderState] = useState<NotesSortOrder>(() => {
    const savedOrder = localStorage.getItem('notesSortOrder') as NotesSortOrder | null;
    return savedOrder || 'newest';
  });
  
  // Theme settings
  const [activeThemeId, setActiveThemeIdState] = useState<string>(() => {
    const savedTheme = localStorage.getItem('activeTheme');
    return savedTheme || 'default';
  });
  
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    const savedMode = localStorage.getItem('colorMode') as ColorMode | null;
    return savedMode || 'dark';
  });
  
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Timer reference for hiding volume UI
  const volumeUITimerRef = useRef<number | null>(null);
  
  // Security state
  const [lockscreenPin, setLockscreenPinState] = useState<string | null>(() => {
    const savedPin = localStorage.getItem('lockscreenPin');
    return savedPin || '1234'; // Default to '1234'
  });
  
  // Derived state: final theme mode
  const currentMode = React.useMemo(() => {
    // Check if the selected theme forces a specific mode
    const selectedTheme = availableThemes.find(theme => theme.id === activeThemeId);
    if (selectedTheme?.forcedMode) {
      return selectedTheme.forcedMode;
    }
    
    // Otherwise, use the user-selected mode
    return colorMode;
  }, [activeThemeId, colorMode]);
  
  // Listen for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Apply current theme to document
  useEffect(() => {
    // Apply or remove the dark class from the HTML element
    if (currentMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply theme class
    document.documentElement.className = document.documentElement.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    
    document.documentElement.classList.add(`theme-${activeThemeId}`);
  }, [currentMode, activeThemeId]);
  
  // Save device type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('deviceType', deviceType);
  }, [deviceType]);
  
  // Save sound setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sound', isSoundEnabled.toString());
  }, [isSoundEnabled]);
  
  // Save volume level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('volumeLevel', Math.round(volumeLevel * 100).toString());
  }, [volumeLevel]);
  
  // Save brightness level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('brightnessLevel', brightnessLevel.toString());
  }, [brightnessLevel]);
  
  // Save mute state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
  }, [isMuted]);
  
  // Save page background setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activePageBg', activePageBgId);
  }, [activePageBgId]);

  // Save weather app settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    if (defaultWeatherLocation) {
      localStorage.setItem('defaultWeatherLocation', defaultWeatherLocation);
    } else {
      localStorage.removeItem('defaultWeatherLocation');
    }
  }, [defaultWeatherLocation]);

  // Save notes app settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notesFontSize', notesFontSize);
  }, [notesFontSize]);

  useEffect(() => {
    localStorage.setItem('notesSortOrder', notesSortOrder);
  }, [notesSortOrder]);
  
  // Save theme settings to localStorage
  useEffect(() => {
    localStorage.setItem('activeTheme', activeThemeId);
  }, [activeThemeId]);
  
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);
  
  // Save lockscreen PIN to localStorage when it changes
  useEffect(() => {
    if (lockscreenPin) {
      localStorage.setItem('lockscreenPin', lockscreenPin);
    } else {
      localStorage.removeItem('lockscreenPin');
    }
  }, [lockscreenPin]);
  
  // Apply volume settings to audio context
  useEffect(() => {
    // Convert volumeLevel from 0-1 to 0-100 scale for setMasterVolume
    const volumePercent = Math.round(volumeLevel * 100);
    setMasterVolume(volumePercent, isMuted);
  }, [volumeLevel, isMuted]);
  
  // Handler to update device type
  const setDeviceType = (type: DeviceType) => {
    // Add transition class to enable smooth transitions
    document.documentElement.classList.add('device-type-transitioning');
    
    // Update state after a small delay to allow CSS transitions to take effect
    setTimeout(() => {
      setDeviceTypeState(type);
      
      // Remove transition class after the device type has been updated and transitions are complete
      setTimeout(() => {
        document.documentElement.classList.remove('device-type-transitioning');
      }, 500); // Match this with the CSS transition duration
    }, 10);
  };
  
  // Handler to toggle sound
  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      // If sound is disabled, mute the audio
      if (!newValue) {
        setMasterVolume(0, true);
      } else {
        // If sound is enabled, restore the volume
        const volumePercent = Math.round(volumeLevel * 100);
        setMasterVolume(volumePercent, isMuted);
      }
      return newValue;
    });
  };
  
  // Handler to update volume level
  const setVolumeLevel = (level: number) => {
    const newLevel = Math.max(0, Math.min(1, level)); // Clamp between 0-1
    setVolumeLevelState(newLevel);
    
    // Update mute state based on volume
    if (newLevel === 0) {
      setIsMuted(true);
    } else if (isMuted && newLevel > 0) {
      setIsMuted(false);
    }
    
    // Apply volume change to audio system
    const volumePercent = Math.round(newLevel * 100);
    setMasterVolume(volumePercent, newLevel === 0 || isMuted);
  };
  
  // Handler to increase volume by 0.1
  const increaseVolume = () => {
    setVolumeLevel(volumeLevel + 0.1);
    triggerVolumeUIShow();
  };
  
  // Handler to decrease volume by 0.1
  const decreaseVolume = () => {
    setVolumeLevel(volumeLevel - 0.1);
    triggerVolumeUIShow();
  };
  
  // Handler to toggle mute state
  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      // Apply mute state to audio system
      const volumePercent = Math.round(volumeLevel * 100);
      setMasterVolume(volumePercent, newMuted);
      return newMuted;
    });
    triggerVolumeUIShow();
  };
  
  // Handler to set page background ID
  const setActivePageBgId = (id: string) => {
    setActivePageBgIdState(id);
    localStorage.setItem('activePageBg', id);
  };

  // Handler to set temperature unit
  const setTempUnit = (unit: TemperatureUnit) => {
    setTempUnitState(unit);
  };

  // Handler to set default weather location
  const setDefaultWeatherLocation = (location: string | null) => {
    setDefaultWeatherLocationState(location);
  };

  // Handler to set notes font size
  const setNotesFontSize = (size: NotesFontSize) => {
    setNotesFontSizeState(size);
  };

  // Handler to set notes sort order
  const setNotesSortOrder = (order: NotesSortOrder) => {
    setNotesSortOrderState(order);
  };
  
  // Handler to set active theme
  const setActiveThemeId = (themeId: string) => {
    setActiveThemeIdState(themeId);
  };
  
  // Handler to set color mode
  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };
  
  // Handler to toggle color mode between light and dark
  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };
  
  // Handler to set brightness level
  const setBrightnessLevel = (level: number) => {
    // Clamp brightness between 10 and 100 to avoid screen becoming too dark
    const newLevel = Math.max(10, Math.min(100, level));
    setBrightnessLevelState(newLevel);
  };
  
  // Handler for opening apps - will be properly implemented by the DeviceFrame component
  const handleOpenApp = (appId: string) => {
    console.log(`Opening app: ${appId} (Context stub - will be overridden by DeviceFrame)`);
    // This will be overridden by the actual implementation in DeviceFrame
    // To allow overriding, we need to expose the SettingsContext instance
  };
  
  // Handler for showing the power menu - will be properly implemented by the DeviceFrame component
  const showPowerMenu = () => {
    console.log('Showing power menu');
    // This is a stub that will be overridden by the actual implementation
  };
  
  // Handler to show volume UI temporarily
  const triggerVolumeUIShow = () => {
    // Clear any existing timer
    if (volumeUITimerRef.current) {
      clearTimeout(volumeUITimerRef.current);
    }
    
    // Show the volume UI
    setShowVolumeUI(true);
    
    // Set a timer to hide it after 3 seconds
    volumeUITimerRef.current = setTimeout(() => {
      setShowVolumeUI(false);
      volumeUITimerRef.current = null;
    }, 3000);
  };
  
  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (volumeUITimerRef.current) {
        clearTimeout(volumeUITimerRef.current);
      }
    };
  }, []);
  
  const setLockscreenPin = (pin: string | null) => {
    setLockscreenPinState(pin);
  };
  
  // Create the context value
  const contextValue: SettingsContextType = {
    deviceType,
    setDeviceType,
    isSoundEnabled,
    toggleSound,
    volumeLevel,
    setVolumeLevel,
    increaseVolume,
    decreaseVolume,
    isMuted,
    toggleMute,
    showVolumeUI,
    triggerVolumeUIShow,
    brightnessLevel,
    setBrightnessLevel,
    activePageBgId,
    setActivePageBgId,
    tempUnit,
    setTempUnit,
    defaultWeatherLocation,
    setDefaultWeatherLocation,
    notesFontSize,
    setNotesFontSize,
    notesSortOrder,
    setNotesSortOrder,
    activeThemeId,
    setActiveThemeId,
    colorMode,
    setColorMode,
    systemPrefersDark,
    currentMode,
    handleOpenApp,
    showPowerMenu,
    toggleColorMode,
    lockscreenPin,
    setLockscreenPin
  };
  
  // Export the context for direct access (needed for overriding methods)
  // @ts-ignore - This is intentional for allowing method overriding
  useSettings.context = SettingsContext;
  
  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 