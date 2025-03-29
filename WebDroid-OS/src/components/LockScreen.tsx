import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { useSettings } from '../contexts/SettingsContext';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [pinDisplay, setPinDisplay] = useState<string>(''); // Will hold entered PIN (max 4 digits)
  const { playSound } = useSound();
  const { deviceType, lockscreenPin } = useSettings();

  // Define keypad layout - number keys only
  const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  // Update time and date every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM AM/PM
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
      
      // Format date as Day of Week, Month Day
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
    };
    
    // Initial call
    updateDateTime();
    
    // Set up interval
    const intervalId = setInterval(updateDateTime, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Effect to check PIN length and auto-validate on 4 digits
  useEffect(() => {
    // Skip validation if no PIN is set (though LockScreen shouldn't appear in this case)
    if (!lockscreenPin) return;
    
    // When PIN reaches 4 digits, automatically validate
    if (pinDisplay.length === 4) {
      // Check if PIN is correct
      if (pinDisplay === lockscreenPin) {
        // Play unlock sound
        playSound('/sounds/unlock.mp3', 0.6);
        
        // Short delay for visual feedback before unlocking
        setTimeout(() => {
          onUnlock();
        }, 300);
      } else {
        // Play error sound for incorrect PIN
        playSound('/sounds/error.mp3', 0.5);
        
        // Reset PIN after a short delay
        setTimeout(() => {
          setPinDisplay('');
        }, 500);
      }
    }
  }, [pinDisplay, onUnlock, playSound, lockscreenPin]);

  // Handle keypad button press
  const handleKeyPress = (key: string) => {
    // Play click sound
    playSound('/sounds/click.mp3', 0.3);
    
    // Only process numeric keys
    if (pinDisplay.length < 4) {
      setPinDisplay(prev => prev + key);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-gradient-to-b from-surface-dark/40 to-surface-dark/70 backdrop-blur-sm">
      {/* Main layout container with spacing for status bar (top) */}
      <div className="flex flex-col h-full pt-6 pb-6">
        {/* Clock and Date Area - More space at top */}
        <div className="flex-grow-2 flex flex-col justify-center items-center py-6">
          {/* Time Section */}
          <div className="text-5xl sm:text-6xl font-light mb-2 text-on-surface font-sans">
            {currentTime}
          </div>
          
          {/* Date Section */}
          <div className="text-lg mb-8 text-on-surface font-medium font-sans">
            {currentDate}
          </div>
          
          {/* PIN Display with modern indicators */}
          <div className="mt-4">
            <div className="flex space-x-4">
              {[0, 1, 2, 3].map(index => (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index < pinDisplay.length 
                      ? 'bg-primary scale-110' 
                      : 'border-2 border-secondary/50'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Keypad Area - Takes remaining space */}
        <div className="flex-grow-3 flex items-center justify-center pb-6">
          {/* Keypad Container - Responsive width */}
          <div className={`w-full mx-auto px-4 ${deviceType === 'tablet' ? 'max-w-sm' : 'max-w-xs'}`}>
            {/* Number grid (1-9) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {numberKeys.slice(0, 9).map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="flex items-center justify-center aspect-square w-full
                            bg-surface-light/20
                            text-2xl rounded-full backdrop-blur-sm
                            text-on-surface
                            active:bg-surface-light/40
                            active:scale-95 transition-all duration-200 font-medium font-sans"
                >
                  {key}
                </button>
              ))}
            </div>
            
            {/* Bottom row with '0' button centered */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="invisible"></div>
              <button
                onClick={() => handleKeyPress('0')}
                className="flex items-center justify-center aspect-square w-full
                          bg-surface-light/20
                          text-2xl rounded-full backdrop-blur-sm
                          text-on-surface
                          active:bg-surface-light/40
                          active:scale-95 transition-all duration-200 font-medium font-sans"
              >
                0
              </button>
              <div className="invisible"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen; 