import React, { useRef, useEffect } from 'react';

interface PowerMenuProps {
  onClose: () => void;
  onPowerOff: () => void;
  onRestart: () => void;
}

const PowerMenu: React.FC<PowerMenuProps> = ({ 
  onClose, 
  onPowerOff, 
  onRestart
}) => {
  const powerOffButtonRef = useRef<HTMLButtonElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle key navigation within the panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const focusableElements = [powerOffButtonRef.current, restartButtonRef.current].filter(Boolean) as HTMLElement[];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Close on Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
    
    // Handle Tab key navigation
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift+Tab: If focus is on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If focus is on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  
  // Focus management for panel
  useEffect(() => {
    // Store the previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Focus the first button when panel opens
    if (powerOffButtonRef.current) {
      powerOffButtonRef.current.focus();
    }
    
    // Restore focus when panel closes
    return () => {
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, []);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="power-menu-title"
      className="absolute inset-x-4 inset-y-1/4 z-50 rounded-xl bg-surface-variant/95 backdrop-blur-md shadow-xl p-5 border border-outline/20"
      onClick={e => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col items-center">
        <h2 id="power-menu-title" className="text-lg font-medium text-on-surface mb-4">Power Options</h2>
        
        <div className="flex items-center justify-around w-full">
          <button
            ref={powerOffButtonRef}
            className="flex flex-col items-center p-3 rounded-xl transition-colors hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onPowerOff}
            aria-label="Power off device"
          >
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-2 text-error">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-error font-medium">Power Off</span>
          </button>
          
          <button
            ref={restartButtonRef}
            className="flex flex-col items-center p-3 rounded-xl transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onRestart}
            aria-label="Restart device"
          >
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-2 text-primary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm text-primary font-medium">Restart</span>
          </button>
        </div>
        
        <button
          className="mt-6 px-4 py-2 bg-surface rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={onClose}
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PowerMenu; 