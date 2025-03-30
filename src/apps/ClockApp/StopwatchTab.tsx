import React, { useState, useEffect, useRef } from 'react';

const StopwatchTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  
  // Use requestAnimationFrame for smooth updates
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Format time in MM:SS.ms format
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Get only the first 2 digits of ms
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Handle animation frame updates
  const updateElapsedTime = () => {
    if (!isRunning || !startTime) return;
    
    const now = Date.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    setElapsedTime(prevElapsed => prevElapsed + delta);
    
    animationFrameRef.current = requestAnimationFrame(updateElapsedTime);
  };

  // Start/resume the stopwatch
  const handleStart = () => {
    setIsRunning(true);
    lastTimeRef.current = Date.now();
    
    // If starting from zero, set a new start time
    if (elapsedTime === 0) {
      setStartTime(Date.now());
    }
  };

  // Stop the stopwatch
  const handleStop = () => {
    setIsRunning(false);
  };

  // Add a lap time
  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [elapsedTime, ...prevLaps]);
    }
  };

  // Reset the stopwatch
  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setLaps([]);
  };

  // Start/stop animation frame loop when running state changes
  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateElapsedTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-start h-full p-4">
      {/* Main display */}
      <div className="text-7xl font-mono text-on-surface my-8">
        {formatTime(elapsedTime)}
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {!isRunning && elapsedTime === 0 ? (
          <button
            onClick={handleStart}
            className="bg-primary text-on-primary px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-primary-dark active:scale-95 transition-all duration-150"
          >
            Start
          </button>
        ) : isRunning ? (
          <>
            <button
              onClick={handleLap}
              className="bg-surface-variant text-on-surface-variant px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-surface-variant/80 active:scale-95 transition-all duration-150"
            >
              Lap
            </button>
            <button
              onClick={handleStop}
              className="bg-error text-on-error px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-error/80 active:scale-95 transition-all duration-150"
            >
              Stop
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="bg-surface-variant text-on-surface-variant px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-surface-variant/80 active:scale-95 transition-all duration-150"
            >
              Reset
            </button>
            <button
              onClick={handleStart}
              className="bg-primary text-on-primary px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-primary-dark active:scale-95 transition-all duration-150"
            >
              Resume
            </button>
          </>
        )}
      </div>
      
      {/* Lap times */}
      {laps.length > 0 && (
        <div className="w-full max-h-60 overflow-y-auto border-t border-outline-variant/10 pt-4">
          <h3 className="text-lg font-medium text-on-surface mb-2 text-center">Laps</h3>
          <ul className="space-y-2">
            {laps.map((lapTime, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-surface-variant/10 rounded">
                <span className="text-on-surface-variant">Lap {laps.length - index}</span>
                <span className="font-mono text-on-surface">{formatTime(lapTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StopwatchTab; 