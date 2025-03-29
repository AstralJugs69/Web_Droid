import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import { useSettings } from '../../contexts/SettingsContext';

const WeatherSettingsPage: React.FC = () => {
  const { 
    tempUnit, 
    setTempUnit, 
    defaultWeatherLocation, 
    setDefaultWeatherLocation 
  } = useSettings();
  const { playSound } = useSound();

  // Local state for the input field with initial value from context
  const [locationInput, setLocationInput] = useState(defaultWeatherLocation || '');
  
  // Debounce timer ref for handling location input
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // Handle temperature unit selection
  const handleTempUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    playSound('/sounds/click.mp3', 0.2);
    setTempUnit(unit);
  };

  // Handle location input change with debounce
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    
    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set a new timer to update after 500ms of inactivity
    const timer = setTimeout(() => {
      // Save empty string as null
      setDefaultWeatherLocation(value.trim() ? value.trim() : null);
    }, 500);
    
    setDebounceTimer(timer);
  };

  // Clean up the debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div className="p-4 space-y-6">
      {/* Temperature Unit Settings */}
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Units
        </h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-on-surface dark:text-dark-on-surface">Temperature Unit</span>
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-dark/10 p-1 dark:bg-dark-surface-light/10">
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  tempUnit === 'celsius'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleTempUnitChange('celsius')}
              >
                °C
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleTempUnitChange('fahrenheit')}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Settings */}
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Location
        </h3>
        <div className="flex flex-col space-y-2">
          <label htmlFor="default-location" className="text-on-surface dark:text-dark-on-surface">
            Default Location
          </label>
          <input
            id="default-location"
            type="text"
            placeholder="Leave blank for auto-detection"
            value={locationInput}
            onChange={handleLocationChange}
            className="w-full p-2 bg-surface dark:bg-dark-surface-light/5 border border-surface-dark/20 dark:border-dark-surface-light/10 rounded-md text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50"
          />
          <p className="text-xs text-secondary/70 dark:text-dark-secondary/70">
            Enter a city name (e.g., "New York") or coordinates (e.g., "40.7,-74.0")
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherSettingsPage; 