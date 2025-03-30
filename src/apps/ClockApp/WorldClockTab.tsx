import React, { useState, useEffect } from 'react';

// Define the WorldTime type for clock entries
interface WorldTime {
  id: string;
  city: string;
  timezone: string;
  offset?: string;
  currentTime?: string;
}

const WorldClockTab: React.FC = () => {
  // Initialize with default cities
  const defaultClocks: WorldTime[] = [
    { id: 'nyc', city: 'New York', timezone: 'America/New_York' },
    { id: 'london', city: 'London', timezone: 'Europe/London' },
    { id: 'tokyo', city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { id: 'sydney', city: 'Sydney', timezone: 'Australia/Sydney' },
    { id: 'paris', city: 'Paris', timezone: 'Europe/Paris' }
  ];

  // State for world clocks
  const [worldClocks, setWorldClocks] = useState<WorldTime[]>(() => {
    // Try to get stored clocks from localStorage
    try {
      const storedClocks = localStorage.getItem('webdroid-worldclocks');
      return storedClocks ? JSON.parse(storedClocks) : defaultClocks;
    } catch (error) {
      console.error('Error loading world clocks:', error);
      return defaultClocks;
    }
  });

  // Function to calculate time offset from local time
  const calculateOffset = (timezone: string): string => {
    try {
      const now = new Date();
      
      // Get local time offset in minutes
      const localOffset = now.getTimezoneOffset();
      
      // Get target timezone offset by formatting date in that timezone and parsing
      const targetTime = now.toLocaleString('en-US', { timeZone: timezone });
      const targetDate = new Date(targetTime);
      
      // Calculate the difference in minutes
      const targetOffsetMs = now.getTime() - targetDate.getTime();
      const targetOffsetMinutes = Math.round(targetOffsetMs / 60000);
      
      // Calculate total offset (difference from UTC)
      const totalOffset = targetOffsetMinutes + localOffset;
      
      // Format offset as +/-HH:MM
      const hours = Math.abs(Math.floor(totalOffset / 60));
      const minutes = Math.abs(totalOffset % 60);
      const sign = totalOffset >= 0 ? '+' : '-';
      
      return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error(`Error calculating offset for ${timezone}:`, error);
      return 'UTC';
    }
  };

  // Update times every minute
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      const updatedClocks = worldClocks.map(clock => {
        try {
          // Get time in the target timezone
          const timeInZone = now.toLocaleTimeString('en-US', {
            timeZone: clock.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          return {
            ...clock,
            currentTime: timeInZone,
            offset: calculateOffset(clock.timezone)
          };
        } catch (error) {
          console.error(`Error formatting time for ${clock.city}:`, error);
          return clock;
        }
      });
      
      setWorldClocks(updatedClocks);
    };
    
    // Update initially
    updateTimes();
    
    // Set interval for updates
    const intervalId = setInterval(updateTimes, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [worldClocks]);

  // Save to localStorage when clocks change
  useEffect(() => {
    try {
      localStorage.setItem('webdroid-worldclocks', JSON.stringify(worldClocks));
    } catch (error) {
      console.error('Error saving world clocks to localStorage:', error);
    }
  }, [worldClocks]);

  // Placeholder handler for adding a city
  const handleAddCity = () => {
    alert('Add city functionality will be implemented in a future update.');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto flex-1">
        {worldClocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-on-surface-variant">No cities added yet. Add a city to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {worldClocks.map(clock => (
              <div key={clock.id} className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-medium text-on-surface">{clock.city}</h3>
                  <p className="text-xs text-on-surface-variant">GMT {clock.offset}</p>
                </div>
                <div className="text-2xl font-light text-on-surface">
                  {clock.currentTime || '--:--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add city button */}
      <button
        onClick={handleAddCity}
        className="absolute bottom-6 right-6 z-10 
                 bg-primary text-on-primary 
                 w-14 h-14 rounded-full shadow-lg 
                 flex items-center justify-center 
                 hover:bg-primary-dark active:scale-95 
                 transition-all duration-150 ease-in-out"
        aria-label="Add City"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default WorldClockTab; 