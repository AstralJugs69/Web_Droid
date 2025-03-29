import React, { useEffect } from 'react';

interface VolumeControlUIProps {
  volumeLevel: number;
  isMuted: boolean;
  isVisible: boolean;
}

const VolumeControlUI: React.FC<VolumeControlUIProps> = ({ 
  volumeLevel, 
  isMuted, 
  isVisible 
}) => {
  // Debug volume level changes
  useEffect(() => {
    console.log('VolumeUI volume:', volumeLevel, 'muted:', isMuted);
  }, [volumeLevel, isMuted]);

  // Determine which icon to display based on volume level
  const renderVolumeIcon = () => {
    if (isMuted || volumeLevel === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
        </svg>
      );
    } else if (volumeLevel < 0.5) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.44 4.44a.75.75 0 011.06 0 8.41 8.41 0 012.93 5.56.75.75 0 01-1.5.008 6.91 6.91 0 00-2.41-4.568.75.75 0 010-1.06z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.44 4.44a.75.75 0 011.06 0 8.41 8.41 0 012.93 5.56.75.75 0 01-1.5.008 6.91 6.91 0 00-2.41-4.568.75.75 0 010-1.06zM12 13.5a.75.75 0 00.75-.75v4.94a.75.75 0 00-1.5 0v-4.94a.75.75 0 00.75.75z" />
        </svg>
      );
    }
  };

  return (
    <div 
      className={`
        absolute top-12 left-1/2 transform -translate-x-1/2 z-50
        bg-surface/80 dark:bg-surface/80 backdrop-blur-sm 
        rounded-full px-4 py-2 shadow-lg
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="text-on-surface dark:text-on-surface">
          {renderVolumeIcon()}
        </div>
        <div className="w-28 h-2 bg-surface-variant dark:bg-surface-variant rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary dark:bg-primary rounded-full will-change-transform transition-all duration-75 ease-out"
            style={{ width: `${isMuted ? 0 : volumeLevel * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VolumeControlUI; 