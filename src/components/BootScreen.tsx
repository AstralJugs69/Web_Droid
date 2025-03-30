import React, { useEffect } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  useEffect(() => {
    // Set timeout to call onBootComplete after the animation finishes (plus a small delay)
    const timer = setTimeout(() => {
      onBootComplete();
    }, 4500); // 4.5 seconds (animation is 4s)

    // Clean up timer if component unmounts
    return () => clearTimeout(timer);
  }, [onBootComplete]);

  return (
    <div className="absolute inset-0 bg-surface-dim z-50 flex flex-col items-center justify-center text-on-primary">
      <h1 className="text-4xl font-bold mb-4">WebDroid</h1>
      <div className="h-1 w-32 bg-surface-variant rounded overflow-hidden">
        <div className="bg-primary h-full progress-bar-animation"></div>
      </div>
      <div className="text-sm mt-4">Booting...</div>
    </div>
  );
};

export default BootScreen; 