import React from 'react';

interface NavigationBarProps {
  onHomeClick?: () => void;
  onBackClick?: () => void;
  onRecentsClick?: () => void;
  hasHistory?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  onHomeClick, 
  onBackClick, 
  onRecentsClick,
  hasHistory = false 
}) => {
  const handleBackClick = () => {
    if (hasHistory && onBackClick) {
      onBackClick();
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  const handleRecentsClick = () => {
    if (onRecentsClick) {
      onRecentsClick();
    }
  };

  return (
    <nav 
      role="navigation" 
      aria-label="Device Navigation"
      className="relative w-full h-12 transition-all duration-300 pointer-events-none"
    >
      <div className="flex items-center justify-around w-full h-full px-4 bg-transparent">
        {/* Back Button */}
        <button 
          onClick={handleBackClick}
          disabled={!hasHistory}
          aria-label="Back"
          aria-disabled={!hasHistory}
          className={`
            p-3 rounded-btn 
            flex items-center justify-center
            transition-all duration-100
            pointer-events-auto
            ${hasHistory 
              ? 'text-on-primary/80 filter drop-shadow-[0_1px_1px_var(--color-shadow)] hover:bg-on-surface/10 active:bg-on-surface/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-on-primary/30 focus:ring-offset-0' 
              : 'text-on-primary/40 cursor-not-allowed disabled:opacity-30'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        {/* Home Button */}
        <button 
          onClick={handleHomeClick}
          aria-label="Home"
          className="
            p-3 rounded-btn 
            flex items-center justify-center
            text-on-primary/80
            filter drop-shadow-[0_1px_1px_var(--color-shadow)]
            transition-all duration-100
            hover:bg-on-surface/10
            active:bg-on-surface/20
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-on-primary/30 focus:ring-offset-0
            pointer-events-auto
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </button>
        
        {/* Recents Button */}
        <button 
          onClick={handleRecentsClick}
          aria-label="Recent Apps"
          className="
            p-3 rounded-btn 
            flex items-center justify-center
            text-on-primary/80
            filter drop-shadow-[0_1px_1px_var(--color-shadow)]
            transition-all duration-100
            hover:bg-on-surface/10
            active:bg-on-surface/20
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-on-primary/30 focus:ring-offset-0
            pointer-events-auto
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar; 