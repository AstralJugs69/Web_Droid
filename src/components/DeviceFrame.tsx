import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import BootScreen from './BootScreen';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import PowerMenu from './PowerMenu';
import VolumeControlUI from './VolumeControlUI';
import RecentsView from './RecentsView';
import DeviceButtons from './DeviceButtons';
import { renderPersistentApps } from '../utils/appManager';

// Import from renderSpecificAppComponent
import CalculatorApp from '../apps/CalculatorApp';
import NotesApp from '../apps/NotesApp';
import WeatherApp from '../apps/WeatherApp';
import CameraApp from '../apps/CameraApp';
import BrowserApp from '../apps/BrowserApp';
import FileExplorerApp from '../apps/FileExplorerApp';
import SettingsApp from '../apps/SettingsApp';
import ThemesApp from '../apps/ThemesApp';
import ClockApp from '../apps/ClockApp/index';

type BootState = 'booting' | 'locked' | 'unlocked' | 'off';

// This function is used elsewhere in the codebase but not directly here
// @ts-ignore
const renderSpecificAppComponent = (appId: string, closeAppFn: (id: string) => void) => {
  switch (appId) {
    case 'calculator':
      return <CalculatorApp closeApp={() => closeAppFn(appId)} />;
    case 'notes':
      return <NotesApp closeApp={() => closeAppFn(appId)} />;
    case 'weather':
      return <WeatherApp closeApp={() => closeAppFn(appId)} />;
    case 'camera':
      return <CameraApp closeApp={() => closeAppFn(appId)} />;
    case 'browser':
      return <BrowserApp closeApp={() => closeAppFn(appId)} />;
    case 'files':
      return <FileExplorerApp closeApp={() => closeAppFn(appId)} />;
    case 'settings':
      return <SettingsApp closeApp={() => closeAppFn(appId)} />;
    case 'themes':
      return <ThemesApp closeApp={() => closeAppFn(appId)} />;
    case 'clock':
      return <ClockApp closeApp={() => closeAppFn(appId)} />;
    default:
      return (
        <div className="flex h-full w-full items-center justify-center text-on-surface bg-surface">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">App Not Found</h2>
            <p>The app "{appId}" does not exist or is not available.</p>
          </div>
        </div>
      );
  }
};

interface DeviceFrameProps {
  handleOpenApp: (appId: string) => void;
  handleCloseApp: () => void;
  handleBackNav: () => void;
  handleRecentsClick: () => void;
  handleRemoveRecentApp: (appIdToRemove: string) => void;
  currentApp: string | null;
  appHistory: string[];
  recentAppsList: string[];
  showRecentsView: boolean;
  hasHistory: boolean;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  handleOpenApp,
  handleCloseApp,
  handleBackNav,
  handleRecentsClick,
  handleRemoveRecentApp,
  currentApp,
  recentAppsList,
  showRecentsView,
  hasHistory
}) => {
  const { 
    deviceType, 
    volumeLevel, 
    isMuted,
    showVolumeUI,
    increaseVolume,
    decreaseVolume,
    activePageBgId,
    brightnessLevel,
    lockscreenPin 
  } = useSettings();
  const { playSound } = useSound();
  const [bootState, setBootState] = useState<BootState>('booting');
  const [screenState, setScreenState] = useState<'on' | 'off'>('on');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showPoweringOffMessage, setShowPoweringOffMessage] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  
  // Listen for custom app opening events
  useEffect(() => {
    const openAppHandler = (event: CustomEvent) => {
      const { appId } = event.detail;
      if (appId && typeof appId === 'string') {
        handleOpenApp(appId);
      }
    };
    
    // Add event listener with type assertion
    window.addEventListener('webdroid:openApp', openAppHandler as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('webdroid:openApp', openAppHandler as EventListener);
    };
  }, [handleOpenApp]);
  
  // Apply the selected page background gradient
  useEffect(() => {
    if (screenRef.current && bootState !== 'off' && bootState !== 'booting') {
      // Set the background to the CSS variable for the selected page background ID
      screenRef.current.style.backgroundImage = `var(--wallpaper-gradient-${activePageBgId})`;
      
      // Apply brightness filter based on brightness level
      screenRef.current.style.filter = `brightness(${brightnessLevel}%)`;
    }
    
    // Clean up
    return () => {
      if (screenRef.current) {
        screenRef.current.style.backgroundImage = '';
        screenRef.current.style.filter = '';
      }
    };
  }, [activePageBgId, bootState, brightnessLevel]);
  
  // Override the SettingsContext handleOpenApp with the actual implementation
  useEffect(() => {
    // Get the SettingsContext instance and override the stub method
    const settingsContext = (useSettings as any).context;
    if (settingsContext && settingsContext.current) {
      settingsContext.current.handleOpenApp = handleOpenApp;
    }
  }, [handleOpenApp]);
  
  // Handle boot completion
  const handleBootComplete = () => {
    // If no PIN is set, skip the lock screen
    if (!lockscreenPin) {
      setBootState('unlocked');
    } else {
      setBootState('locked');
    }
  };
  
  // Handle unlock
  const handleUnlock = () => {
    setBootState('unlocked');
  };

  // Toggle power - handles both power off and power on
  const togglePower = () => {
    if (bootState === 'off') {
      // Power on sequence
      setBootState('booting');
    } else {
      // Power off sequence
      setShowPowerMenu(false);
      // Show "Powering Off..." message briefly
      setShowPoweringOffMessage(true);
      
      // Set timeout to switch to 'off' state after showing message
      setTimeout(() => {
        setShowPoweringOffMessage(false);
        setBootState('off');
      }, 1500);
    }
  };
  
  // Render persistent apps for unlocked state
  const renderApps = () => {
    if (bootState !== 'unlocked') return null;
    
    // Render Home Screen when no app is active (currentApp is null)
    const homeScreen = (
      <div 
        className={`absolute inset-0 z-20 transition-opacity duration-300 ${
          currentApp === null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <HomeScreen onOpenApp={handleOpenApp} />
      </div>
    );
    
    // Render all recent apps with persistent state
    const persistentApps = renderPersistentApps(
      recentAppsList, 
      currentApp, 
      handleCloseApp
    );
    
    return (
      <>
        {homeScreen}
        {persistentApps}
      </>
    );
  };

  // Handle power off action
  const handlePowerOffAction = () => {
    // First turn the screen off
    setScreenState('off');
    // Then initiate the power off sequence
    setTimeout(() => {
      togglePower();
    }, 100); // Small delay to ensure screen off is processed first
  };
  
  // Handle restart action
  const handleRestartAction = () => {
    setShowPowerMenu(false);
    handleCloseApp(); // Close any open apps
    
    // If device is off, restart directly from off state
    if (bootState === 'off') {
      setBootState('booting');
    } else {
      // If device is on, show powering off message briefly before booting
      setShowPoweringOffMessage(true);
      setTimeout(() => {
        setShowPoweringOffMessage(false);
        setBootState('booting');
      }, 800); 
    }
  };
  
  // Handle short power button press
  const handleShortPowerPress = () => {
    if (bootState === 'off') {
      togglePower();
      return;
    }
    
    // Play sound effect
    playSound('/sounds/click.mp3', 0.4);
    
    if (screenState === 'on') {
      // Turn screen off
      setScreenState('off');
    } else {
      // Turn screen on
      setScreenState('on');
    }
  };
  
  // Handle power button long press
  const handleLongPowerPress = () => {
    console.log('Power button long pressed!');
    if (bootState !== 'off') {
      setShowPowerMenu(true);
      playSound('/sounds/confirm.mp3', 0.5);
    }
  };
  
  // Handle volume button presses
  const handleVolumeUp = () => {
    if (bootState === 'off') return;
    playSound('/sounds/click.mp3', 0.4);
    increaseVolume();
  };
  
  const handleVolumeDown = () => {
    if (bootState === 'off') return;
    playSound('/sounds/click.mp3', 0.4);
    decreaseVolume();
  };
  
  // Handle screen state changes
  useEffect(() => {
    // Lock the device when screen turns off while unlocked
    if (screenState === 'off' && bootState === 'unlocked') {
      setBootState('locked');
    }
  }, [screenState, bootState]);

  // Screen styles based on device type
  const screenStyles = deviceType === 'phone'
    ? 'aspect-[9/19] h-[85vh] max-h-[800px]'
    : 'aspect-[4/3] h-[80vh] max-h-[900px]';

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center bg-background`}>
      <div 
        id="device-frame" 
        ref={frameRef}
        className={`relative shadow-2xl shadow-[0_0_10px_rgba(180,180,200,0.1)] dark:shadow-[0_0_15px_rgba(200,200,255,0.08)] transition-all duration-500 ease-in-out bg-black ${
          deviceType === 'phone' 
            ? 'device-frame-phone-cutouts p-3 rounded-3xl' 
            : 'device-frame-tablet-cutouts p-4 rounded-3xl'
        } opacity-100 scale-100`}
      >
        <div 
          id="device-screen" 
          ref={screenRef}
          className={`relative overflow-hidden rounded-xl transition-all duration-700 ${screenStyles} ${
            bootState === 'off' ? 'bg-surface-dim' : ''
          } ${screenState === 'off' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 z-20`}
          onClick={(e) => e.stopPropagation()} // Prevent triggering long press when interacting with screen
        >
          {bootState === 'booting' && <BootScreen onBootComplete={handleBootComplete} />}
          {bootState === 'locked' && <LockScreen onUnlock={handleUnlock} />}
          
          {/* Render apps with persistent state when unlocked */}
          {bootState === 'unlocked' && renderApps()}
          
          {/* Powering off message overlay */}
          {showPoweringOffMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-scrim z-50 transition-opacity duration-500">
              <p className="text-on-primary text-xl">Powering off...</p>
            </div>
          )}
          
          {/* Only show status bar when not powered off and screen is on */}
          {bootState !== 'off' && screenState === 'on' && <StatusBar />}
          
          {/* Recents View */}
          {bootState === 'unlocked' && screenState === 'on' && showRecentsView && (
            <RecentsView
              recentAppsList={recentAppsList}
              currentApp={currentApp}
              onSelectApp={handleOpenApp}
              onRemoveApp={handleRemoveRecentApp}
            />
          )}
          
          {/* Navigation bar hover detection area */}
          {bootState === 'unlocked' && screenState === 'on' && (
            <div 
              className="absolute bottom-0 left-0 right-0 z-40 h-12 pointer-events-none"
              onMouseEnter={() => setShowNavBar(true)}
              onMouseLeave={() => setShowNavBar(false)}
            >
              {/* Always render NavigationBar, but control visibility with CSS */}
              <div 
                className={`w-full transition-all duration-300 ease-in-out ${
                  showNavBar 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-3 pointer-events-none'
                }`}
              >
                <NavigationBar 
                  onHomeClick={handleCloseApp}
                  onBackClick={handleBackNav}
                  onRecentsClick={handleRecentsClick}
                  hasHistory={hasHistory}
                />
              </div>
            </div>
          )}
          
          {/* Volume Control UI */}
          {bootState !== 'off' && screenState === 'on' && (
            <VolumeControlUI 
              volumeLevel={volumeLevel} 
              isMuted={isMuted} 
              isVisible={showVolumeUI} 
            />
          )}
          
          {/* Power menu panel - now inside the device screen */}
          {showPowerMenu && bootState !== 'off' && screenState === 'on' && (
            <>
              {/* Semi-transparent backdrop */}
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setShowPowerMenu(false)}
              ></div>
              
              {/* Power menu */}
              <PowerMenu 
                onClose={() => setShowPowerMenu(false)}
                onPowerOff={handlePowerOffAction}
                onRestart={handleRestartAction}
              />
            </>
          )}
        </div>
        
        {/* Device Buttons */}
        <DeviceButtons 
          deviceType={deviceType}
          bootState={bootState}
          onVolumeUp={handleVolumeUp}
          onVolumeDown={handleVolumeDown}
          onShortPowerPress={handleShortPowerPress}
          onLongPowerPress={handleLongPowerPress}
        />
      </div>
    </div>
  );
};

export default DeviceFrame; 