import React, { useState, useEffect } from 'react';

const DigitalClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Format time without seconds
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-8xl font-light text-on-surface mb-4">
        {formatTime(currentTime)}
      </div>
      <div className="text-lg text-on-surface-variant">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default DigitalClockDisplay; 