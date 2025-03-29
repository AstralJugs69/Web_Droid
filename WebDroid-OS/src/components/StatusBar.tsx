import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';
import { useDrag } from '@use-gesture/react';

interface StatusBarProps {
  batteryLevel?: number;
}

type ShadeState = 'closed' | 'opening' | 'open' | 'closing';

interface Notification {
  id: number;
  title: string;
  time: string;
  app: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ batteryLevel = 85 }) => {
  const [time, setTime] = useState(new Date());
  const [shadeState, setShadeState] = useState<ShadeState>('closed');
  const [shadeTranslateY, setShadeTranslateY] = useState<number>(-10000);
  const [isDragging, setIsDragging] = useState(false);
  const [shadeHeight, setShadeHeight] = useState(500);
  const [isHovering, setIsHovering] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'System update available', time: '5min ago', app: 'System' },
    { id: 2, title: 'Welcome to WebDroid OS', time: '10min ago', app: 'System' }
  ]);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  
  const { 
    volumeLevel, 
    isMuted, 
    toggleMute, 
    handleOpenApp, 
    deviceType, 
    showPowerMenu, 
    toggleColorMode, 
    currentMode,
    brightnessLevel, 
    setBrightnessLevel,
    setDeviceType
  } = useSettings();
  const { playSound } = useSound();
  
  const shadeRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  // Calculate and update the shade height when mounted and on window resize
  useLayoutEffect(() => {
    const updateShadeHeight = () => {
      // Change to 60% of window height (previously 50%)
      const height = window.innerHeight * 0.6;
      setShadeHeight(height);
      // Position the shade fully offscreen with extra margin
      setShadeTranslateY(-height - 20); // Add 20px extra to ensure it's fully hidden
    };
    
    updateShadeHeight();
    window.addEventListener('resize', updateShadeHeight);
    return () => window.removeEventListener('resize', updateShadeHeight);
  }, []);

  // Update the time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle closing shade when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shadeState === 'open' && 
        shadeRef.current && 
        !shadeRef.current.contains(event.target as Node) &&
        statusBarRef.current && 
        !statusBarRef.current.contains(event.target as Node)
      ) {
        setShadeState('closing');
        // Use actual height for animation
        setTimeout(() => setShadeTranslateY(-shadeHeight), 10);
        // Set final state after animation completes
        setTimeout(() => setShadeState('closed'), 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [shadeState, shadeHeight]);
  
  // Update shadeTranslateY when shadeState changes (for non-drag animations)
  useEffect(() => {
    if (!isDragging) {
      if (shadeState === 'open') {
        setShadeTranslateY(0);
      } else if (shadeState === 'closed') {
        setShadeTranslateY(-shadeHeight - 20); // Add 20px extra to ensure it's fully hidden
      }
    }
  }, [shadeState, shadeHeight, isDragging]);
  
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Calculate blur intensity based on shade position
  const calculateBlurAmount = () => {
    if (shadeHeight === 0) return 0;
    // Calculate percentage of shade that is visible (0-1)
    const visiblePercentage = Math.min(1, Math.max(0, (shadeHeight + shadeTranslateY) / shadeHeight));
    // Max blur when fully visible, no blur when fully hidden
    return Math.round(visiblePercentage * 12); // 12px max blur
  };
  
  // Calculate overlay opacity based on shade position
  const calculateOverlayOpacity = () => {
    if (shadeHeight === 0) return 0;
    const visiblePercentage = Math.min(1, Math.max(0, (shadeHeight + shadeTranslateY) / shadeHeight));
    return visiblePercentage * 0.5; // 50% max opacity
  };
  
  // Drag gesture binding for the visible status bar
  const bind = useDrag(({ active, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
    setIsDragging(active);
    
    if (active) {
      // Calculate the new Y position based on the current state and drag movement
      // If shade is open, start from 0 and go negative; if closed, start from -shadeHeight
      const basePosition = shadeState === 'open' || shadeState === 'opening' ? 0 : -shadeHeight;
      const newY = Math.max(-shadeHeight, Math.min(0, basePosition + my));
      setShadeTranslateY(newY);
    } else {
      // Drag ended - decide whether to open or close based on position and velocity
      const openThreshold = shadeHeight * 0.3; // 30% of shade height
      const velocityThreshold = 0.5;
      
      const isFlungDown = vy > velocityThreshold && dy > 0;
      const isFlungUp = vy > velocityThreshold && dy < 0;
      const isDraggedDown = my > openThreshold;
      const isDraggedUp = my < -openThreshold;
      
      // Determine the new state
      if ((shadeState === 'closed' || shadeState === 'closing') && (isFlungDown || isDraggedDown)) {
        setShadeState('opening');
        playSound('/sounds/slide.mp3', 0.2);
        setTimeout(() => setShadeState('open'), 300);
      } else if ((shadeState === 'open' || shadeState === 'opening') && (isFlungUp || isDraggedUp)) {
        setShadeState('closing');
        playSound('/sounds/slide.mp3', 0.2);
        setTimeout(() => setShadeState('closed'), 300);
      } else {
        // Snap back to previous state
        setShadeState(shadeState === 'open' || shadeState === 'opening' ? 'open' : 'closed');
      }
    }
  }, { 
    axis: 'y', // Only track vertical movement
    bounds: { top: -shadeHeight, bottom: 0 }, // Limit drag range
    rubberband: 0.05, // Slight rubber band effect
    from: () => [0, shadeTranslateY] // Start from current position
  });
  
  // Handle clearing all notifications
  const handleClearNotifications = () => {
    playSound('/sounds/click.mp3', 0.3);
    setNotifications([]);
  };
  
  // Handle brightness change
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setBrightnessLevel(newValue);
    
    // This would normally adjust screen brightness through a system API
    // For this simulation, we'll just update the state through the context
    playSound('/sounds/click.mp3', 0.2);
  };
  
  // Handle power button click
  const handlePowerClick = () => {
    playSound('/sounds/click.mp3', 0.3);
    
    // Close the shade
    setShadeState('closing');
    setTimeout(() => {
      setShadeTranslateY(-shadeHeight);
      setShadeState('closed');
      
      // Open the power menu
      showPowerMenu();
    }, 300);
  };
  
  // Handle toggling Bluetooth
  const handleBluetoothToggle = () => {
    playSound('/sounds/click.mp3', 0.3);
    setBluetoothEnabled(prev => !prev);
    alert(`Bluetooth ${!bluetoothEnabled ? 'enabled' : 'disabled'}`);
  };
  
  // Handle opening settings
  const handleOpenSettings = () => {
    playSound('/sounds/click.mp3', 0.3);
    
    // Close the shade first
    setShadeState('closing');
    setTimeout(() => {
      setShadeTranslateY(-shadeHeight);
      setShadeState('closed');
      
      // Directly open the settings app without going through the context
      // This ensures we're using the actual function from App.tsx/DeviceFrame
      window.dispatchEvent(new CustomEvent('webdroid:openApp', { 
        detail: { appId: 'settings' } 
      }));
    }, 300);
  };
  
  // Toggle dark/light mode
  const handleDarkModeToggle = () => {
    playSound('/sounds/click.mp3', 0.3);
    toggleColorMode();
  };

  return (
    <>
      {/* Part 1: Always-visible Status Bar (Transparent) */}
      <div 
        ref={statusBarRef}
        className="absolute top-0 left-0 right-0 z-[1000] bg-transparent"
        {...bind()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Status bar hover indicator */}
        <div 
          className={`absolute inset-x-0 top-0 h-1 bg-primary/70 transition-opacity duration-200 ease-in-out rounded-b-sm ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        
        <div className={`flex justify-between items-center h-6 px-2 py-1 text-xs transition-all duration-200 ease-in-out ${
          isHovering ? 'bg-surface/10 backdrop-blur-sm' : 'bg-transparent'
        }`}>
          <div className={`text-sm font-medium filter drop-shadow-md transition-colors duration-200 ${
            isHovering ? 'text-on-surface' : 'text-on-surface/80'
          }`}>
            {formattedTime}
          </div>
          <div className="flex items-center space-x-3">
            {/* Status icons */}
            <div className={`filter drop-shadow-md flex items-center space-x-2 transition-colors duration-200 ${
              isHovering ? 'text-on-surface' : 'text-on-surface/80'
            }`}>
              {/* WiFi icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              
              {/* Sound icon - clickable now */}
              <button 
                className="flex items-center justify-center"
                onClick={() => {
                  playSound('/sounds/click.mp3', 0.3);
                  toggleMute(); 
                }}
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                {volumeLevel === 0 || isMuted ? (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                )}
              </svg>
              </button>
              
              {/* Battery icon */}
              <div className="flex items-center text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H4z" />
                  <path d="M18 9a1 1 0 00-1-1h-1v4h1a1 1 0 001-1V9z" />
                  <rect
                    x="4"
                    y="7"
                    width={8 * (batteryLevel / 100)}
                    height="6"
                    rx="0.5"
                    fill="currentColor"
                  />
                </svg>
                {batteryLevel}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Pull indicator - visible on hover */}
        <div className={`absolute left-0 right-0 bottom-0 flex justify-center items-center ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Dimming overlay that appears behind the shade */}
      {(shadeState !== 'closed' || isDragging) && (
        <div 
          className="absolute inset-0 bg-scrim transition-opacity duration-300 ease-out z-[995]"
          style={{ 
            opacity: calculateOverlayOpacity(),
            pointerEvents: shadeState === 'open' ? 'auto' : 'none'
          }}
          onClick={() => {
            if (shadeState === 'open') {
              setShadeState('closing');
              playSound('/sounds/slide.mp3', 0.2);
              setTimeout(() => setShadeTranslateY(-shadeHeight), 10);
              setTimeout(() => setShadeState('closed'), 300);
            }
          }}
        />
      )}
      
      {/* Part 2: Notification Shade Panel */}
      <div 
        ref={shadeRef}
        className="absolute top-0 left-0 right-0 z-[999] bg-surface/90 shadow-lg rounded-b border-t-0 border-x border-b border-outline-variant overflow-y-auto p-4"
        style={{
          height: `${shadeHeight}px`,
          transform: `translateY(${shadeTranslateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          backdropFilter: `blur(${calculateBlurAmount()}px)`,
          WebkitBackdropFilter: `blur(${calculateBlurAmount()}px)`,
          visibility: shadeState === 'closed' && !isDragging ? 'hidden' : 'visible', // Hide completely when closed
        }}
        aria-expanded={shadeState === 'open' || shadeState === 'opening'}
        role="region"
        aria-label="Notifications"
      >
        {/* Pull indicator - only show when not hidden */}
        {(shadeState !== 'closed' || isDragging) && (
          <div className="absolute bottom-full left-0 right-0 flex justify-center pointer-events-none">
            <div className={`w-10 h-1 rounded-full bg-on-surface/20 mb-1 ${isDragging ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} />
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-on-surface">Notifications</h3>
          <button 
            className="text-sm font-medium text-primary hover:underline"
            aria-label="Clear all notifications"
            onClick={handleClearNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
        
        {/* Notification List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(item => (
              <div 
                key={item.id} 
                className="p-3 bg-surface-light rounded border border-surface-dark/10 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-on-surface">{item.title}</span>
                  <span className="text-xs text-on-surface-variant px-1.5 py-0.5 bg-surface/50 rounded-full ml-2">{item.time}</span>
                </div>
                <div className="text-sm text-on-surface-variant mt-1 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                  {item.app}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary/50 mb-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            <p className="text-on-surface-variant font-medium mb-1">No notifications</p>
            <p className="text-sm text-on-surface-variant/70 text-center">You're all caught up!</p>
          </div>
        )}
        
        {/* Quick Settings Buttons */}
        <div className="mt-4 mb-4">
          {/* Quick Settings Grid */}
          <div className="grid grid-cols-4 gap-3 px-4">
            {/* WiFi Toggle */}
            <button 
              className="flex flex-col items-center justify-center space-y-1 bg-surface-variant/50 dark:bg-dark-surface-variant/50 rounded-xl p-2 w-14 h-14 transition-colors hover:bg-surface-accent/20 active:scale-95"
              onClick={() => {
                playSound('/sounds/click.mp3', 0.3);
                alert('WiFi settings would open here');
              }}
              aria-label="WiFi Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-on-surface-variant" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-on-surface-variant">WiFi</span>
            </button>
            
            {/* Bluetooth Toggle */}
            <button 
              className={`flex flex-col items-center justify-center space-y-1 rounded-xl p-2 w-14 h-14 transition-colors hover:bg-surface-accent/20 active:scale-95 ${
                bluetoothEnabled ? 'bg-primary/10 text-primary' : 'bg-surface-variant/50 dark:bg-dark-surface-variant/50 text-on-surface-variant'
              }`}
              onClick={handleBluetoothToggle}
              aria-label={`${bluetoothEnabled ? 'Disable' : 'Enable'} Bluetooth`}
              aria-pressed={bluetoothEnabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 6a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3A1 1 0 019 13V7a1 1 0 011-1zm0 2.414v3.172l1.586-1.586L10 8.414z" clipRule="evenodd" />
                <path d="M10 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1zm0 10a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
              </svg>
              <span className="text-xs font-medium">Bluetooth</span>
            </button>
            
            {/* Device Type Toggle */}
            <button 
              className={`flex flex-col items-center justify-center space-y-1 rounded-xl p-2 w-14 h-14 transition-colors hover:bg-surface-accent/20 active:scale-95 ${
                deviceType === 'tablet' ? 'bg-primary/10 text-primary' : 'bg-surface-variant/50 dark:bg-dark-surface-variant/50 text-on-surface-variant'
              }`}
              onClick={() => {
                const newType = deviceType === 'phone' ? 'tablet' : 'phone';
                setDeviceType(newType);
                playSound('/sounds/click.mp3', 0.3);
              }}
              aria-label={`Switch to ${deviceType === 'phone' ? 'Tablet' : 'Phone'} Mode`}
              aria-pressed={deviceType === 'tablet'}
            >
              {deviceType === 'phone' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium">{deviceType === 'phone' ? 'Phone' : 'Tablet'}</span>
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              className={`flex flex-col items-center justify-center space-y-1 rounded-xl p-2 w-14 h-14 transition-colors hover:bg-surface-accent/20 active:scale-95 ${
                currentMode === 'dark' ? 'bg-primary/10 text-primary' : 'bg-surface-variant/50 dark:bg-dark-surface-variant/50 text-on-surface-variant'
              }`}
              onClick={handleDarkModeToggle}
              aria-label={`${currentMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-pressed={currentMode === 'dark'}
            >
              {currentMode === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium">{currentMode === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            
            {/* Power Options */}
            <button 
              className="flex flex-col items-center justify-center space-y-1 bg-surface-variant/50 dark:bg-dark-surface-variant/50 rounded-xl p-2 w-14 h-14 transition-colors hover:bg-surface-accent/20 active:scale-95"
              onClick={handlePowerClick}
              aria-label="Power Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-on-surface-variant" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6a1 1 0 11-2 0V3a1 1 0 011-1zm-1 12a1 1 0 112 0 1 1 0 01-2 0zm7.95-8.95a7 7 0 00-9.9 0 1 1 0 111.414-1.414 5 5 0 017.07 0 1 1 0 01-1.413 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-on-surface-variant">Power</span>
            </button>
          </div>
          
          {/* Brightness Slider - Ensure this section is visible */}
          <div className="px-4 pt-5 pb-3 mt-3 border-t border-outline-variant/30">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              
              <input 
                type="range"
                className="flex-grow h-2.5 bg-surface-variant/50 dark:bg-dark-surface-variant/50 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-dark-primary"
                min="10"
                max="100"
                value={brightnessLevel}
                onChange={handleBrightnessChange}
                aria-label="Screen Brightness"
              />
              
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Settings button - fixed at the bottom with reduced margin */}
        <button
          className="mt-3 w-full flex items-center justify-center py-2.5 px-4 rounded-xl
                     bg-surface hover:bg-surface-variant transition-colors
                     text-on-surface text-sm font-medium"
          onClick={handleOpenSettings}
          aria-label="Open Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Settings
        </button>
      </div>
    </>
  );
};

export default StatusBar; 