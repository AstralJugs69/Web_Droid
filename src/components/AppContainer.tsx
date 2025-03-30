import React, { useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

// Interface for app preview state
export interface AppPreviewState {
  type: string;
  [key: string]: any;
}

// Type for the preview state getter function
export type PreviewStateGetter = () => AppPreviewState;

interface AppContainerProps {
  appId: string;
  children: React.ReactNode;
  title?: string;
  showAppBar?: boolean;
  onBackClick?: () => void;
  actionButtons?: React.ReactNode;
  appBarContent?: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ 
  appId, 
  children, 
  title, 
  showAppBar = false, 
  onBackClick,
  actionButtons,
  appBarContent
}) => {
  const { playSound } = useSound();
  const soundPlayedRef = useRef(false);
  
  // Play sound effect when app opens
  useEffect(() => {
    // Only play the sound if it hasn't been played yet
    if (!soundPlayedRef.current) {
      playSound('/sounds/click.mp3', 0.4);
      soundPlayedRef.current = true;
    }
  }, [playSound]);

  return (
    <main 
      id={`app-container-${appId}`} 
      className="absolute inset-0 z-30 flex flex-col overflow-hidden bg-surface-light"
    >
      {/* App Bar Area */}
      {showAppBar && (
        <header 
          role="toolbar" 
          aria-label={title ? `${title} toolbar` : 'App toolbar'} 
          className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-surface-dark/10 bg-surface-light/80 backdrop-blur-sm"
        >
          {appBarContent ? (
            appBarContent
          ) : (
            <>
              <div className="flex items-center">
                {onBackClick && (
                  <button 
                    onClick={onBackClick}
                    className="p-2 rounded-btn mr-2 text-on-surface hover:bg-surface/20 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                    aria-label="Back"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}
                {title && (
                  <h1 id={`${appId}-title`} className="text-lg font-medium text-on-surface font-sans">
                    <span className="relative inline-block">
                      <span className="invisible">{title}</span>
                      <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">{title}</span>
                    </span>
                  </h1>
                )}
              </div>
              
              {/* Action buttons area */}
              <div className="flex items-center">
                {actionButtons}
              </div>
            </>
          )}
        </header>
      )}
      
      {/* App Content Area */}
      <section 
        id={`app-content-area-${appId}`}
        data-app-id={appId}
        aria-labelledby={title ? `${appId}-title` : undefined}
        className="flex-grow overflow-auto"
      >
        {/* Check if we have children before rendering */}
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-error" role="alert">Error: No content provided for app "{appId}"</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AppContainer; 