import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

// Timer states
type TimerState = 'stopped' | 'running' | 'paused';

// Preset durations in minutes
const PRESET_DURATIONS = [1, 5, 10, 15, 30, 60];

const TimerTab: React.FC = () => {
  const [durationMinutes, setDurationMinutes] = useState(60); // Default to 60 mins
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [targetEndTime, setTargetEndTime] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { playSound } = useSound();

  // Calculate target end time from current time in the future
  const getEndTimeFromDuration = (minutes: number): number => {
    return Date.now() + minutes * 60 * 1000;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time to display the target end time
  const formatEndTime = (): string => {
    if (!targetEndTime) return '';
    
    const endDate = new Date(targetEndTime);
    return endDate.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Start the timer
  const handleStart = () => {
    playSound('/sounds/click.mp3', 0.3);
    
    // Set end time and initial remaining time
    const endTime = getEndTimeFromDuration(durationMinutes);
    setTargetEndTime(endTime);
    
    // Calculate initial remaining seconds
    const initialRemaining = Math.round((endTime - Date.now()) / 1000);
    setRemainingSeconds(initialRemaining);
    
    setTimerState('running');
  };

  // Pause the timer
  const handlePause = () => {
    playSound('/sounds/click.mp3', 0.3);
    setTimerState('paused');
  };

  // Resume the timer
  const handleResume = () => {
    playSound('/sounds/click.mp3', 0.3);
    
    if (remainingSeconds && remainingSeconds > 0) {
      // Calculate new end time based on remaining seconds
      const newEndTime = Date.now() + (remainingSeconds * 1000);
      setTargetEndTime(newEndTime);
      setTimerState('running');
    }
  };

  // Cancel the timer
  const handleCancel = () => {
    playSound('/sounds/click.mp3', 0.3);
    setTimerState('stopped');
    setRemainingSeconds(null);
    setTargetEndTime(null);
  };

  // Set custom duration
  const handleDurationSelect = (minutes: number) => {
    if (timerState === 'stopped') {
      playSound('/sounds/click.mp3', 0.2);
      setDurationMinutes(minutes);
    }
  };

  // Update timer every second when running
  useEffect(() => {
    if (timerState === 'running' && targetEndTime) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.round((targetEndTime - now) / 1000);
        
        if (remaining <= 0) {
          // Timer finished
          setRemainingSeconds(0);
          setTimerState('stopped');
          playSound('/sounds/alarm.mp3', 0.5);
          
          // Clear the interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          setRemainingSeconds(remaining);
        }
      };
      
      // Update immediately
      updateTimer();
      
      // Set interval for updates
      intervalRef.current = window.setInterval(updateTimer, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [timerState, targetEndTime]);

  return (
    <div className="flex flex-col items-center justify-between h-full p-4">
      {/* Timer display */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-7xl font-mono text-on-surface">
          {remainingSeconds !== null ? formatTime(remainingSeconds) : formatTime(durationMinutes * 60)}
        </div>
      </div>
      
      {/* Timer controls */}
      <div className="w-full">
        {timerState === 'stopped' ? (
          <>
            {/* Preset durations */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {PRESET_DURATIONS.map(duration => (
                <button
                  key={duration}
                  onClick={() => handleDurationSelect(duration)}
                  className={`py-2 rounded-lg text-center transition-colors ${
                    durationMinutes === duration 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80'
                  }`}
                >
                  {duration} {duration === 1 ? 'min' : 'mins'}
                </button>
              ))}
            </div>
            
            {/* Start button */}
            <div className="px-4 mb-6">
              <button
                onClick={handleStart}
                className="w-full py-3 bg-primary text-on-primary rounded-full text-lg font-medium shadow-md hover:bg-primary-dark active:scale-95 transition-all duration-150"
              >
                Start
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center space-x-4 mb-6">
            {timerState === 'running' ? (
              <>
                <button
                  onClick={handlePause}
                  className="px-6 py-3 bg-surface-variant text-on-surface-variant rounded-full text-lg font-medium shadow-md hover:bg-surface-variant/80 active:scale-95 transition-all duration-150"
                >
                  Pause
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-error text-on-error rounded-full text-lg font-medium shadow-md hover:bg-error/80 active:scale-95 transition-all duration-150"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-surface-variant text-on-surface-variant rounded-full text-lg font-medium shadow-md hover:bg-surface-variant/80 active:scale-95 transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResume}
                  className="px-6 py-3 bg-primary text-on-primary rounded-full text-lg font-medium shadow-md hover:bg-primary-dark active:scale-95 transition-all duration-150"
                >
                  Resume
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerTab; 