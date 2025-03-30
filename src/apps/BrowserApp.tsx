import React, { useState, useRef, useCallback } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';

interface BrowserAppProps {
  closeApp: () => void;
}

const BrowserApp: React.FC<BrowserAppProps> = ({ closeApp }) => {
  // URL states - only for display in the address bar
  const [displayUrl, setDisplayUrl] = useState<string>('');
  
  // Browser states for history navigation
  const [history, setHistory] = useState<string[]>(['about:blank']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Refs
  const addressBarRef = useRef<HTMLInputElement>(null);
  
  // Sound effects
  const { playSound } = useSound();
  
  // Computed properties
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleNavigate = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!displayUrl) return;
    
    // Basic URL validation
    let validatedUrl = displayUrl;
    
    // Add https:// if protocol is missing
    if (!/^https?:\/\//i.test(validatedUrl)) {
      validatedUrl = `https://${validatedUrl}`;
      setDisplayUrl(validatedUrl);
    }
    
    playSound('/sounds/click.mp3', 0.2);
    
    // Open the URL in a new tab
    window.open(validatedUrl, '_blank', 'noopener,noreferrer');
    
    // Only update history if the URL is different from current
    if (validatedUrl !== history[historyIndex]) {
      // Remove any forward history entries
      const newHistory = history.slice(0, historyIndex + 1);
      // Add the new URL to history
      newHistory.push(validatedUrl);
      // Update history state
      setHistory(newHistory);
      // Update history index to point to the new URL
      setHistoryIndex(newHistory.length - 1);
    }
  }, [displayUrl, history, historyIndex, playSound]);

  const handleBack = useCallback(() => {
    if (canGoBack) {
      playSound('/sounds/click.mp3', 0.2);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDisplayUrl(history[newIndex]);
    }
  }, [canGoBack, historyIndex, history, playSound]);

  const handleForward = useCallback(() => {
    if (canGoForward) {
      playSound('/sounds/click.mp3', 0.2);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDisplayUrl(history[newIndex]);
    }
  }, [canGoForward, historyIndex, history, playSound]);

  const handleGoHome = useCallback(() => {
    playSound('/sounds/click.mp3', 0.2);
    const homeUrl = '';
    setDisplayUrl(homeUrl);
    
    // Add to history if different from current
    if (homeUrl !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(homeUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex, playSound]);

  const handleClearUrl = useCallback(() => {
    setDisplayUrl('');
    if (addressBarRef.current) {
      addressBarRef.current.focus();
    }
  }, []);

  // Create app bar content with browser functions
  const renderAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full h-full gap-x-2">
        {/* Navigation Controls */}
        <button
          type="button"
          onClick={handleBack}
          disabled={!canGoBack}
          className="p-1 rounded-btn text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleForward}
          disabled={!canGoForward}
          className="p-1 rounded-btn text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Go forward"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        
        {/* Address Bar */}
        <div className="relative flex-grow flex items-center bg-surface rounded-btn px-3 shadow-inner-sm">
          {/* Globe Icon */}
          <div className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-on-surface-variant" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* URL Input */}
          <form onSubmit={handleNavigate} className="flex-grow relative">
            <input
              type="url"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
              ref={addressBarRef}
              placeholder="Search or enter address"
              className="w-full border-none ring-0 focus:ring-0 outline-none bg-transparent text-on-surface py-1 pr-8 font-sans"
              autoComplete="off"
            />
            {displayUrl && (
              <button
                type="button"
                onClick={handleClearUrl}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </form>
        </div>
        
        {/* Action Buttons */}
        <button
          type="button"
          onClick={handleGoHome}
          className="p-1 rounded-btn text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200"
          aria-label="Go to home page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={closeApp}
          className="p-1 rounded-btn text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200"
          aria-label="Close browser"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <AppContainer
      appId="browser"
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className="flex flex-col h-full w-full bg-page-background overflow-hidden">
        {/* Main Content - Browser page placeholder */}
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-on-surface-variant font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-primary/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
          <p className="mb-2 text-lg font-medium text-on-surface">WebDroid Browser</p>
          <p>Enter a URL above and press 'Go' or Enter to open it in a new browser tab.</p>
          
          {displayUrl && (
            <div className="mt-4 p-4 bg-surface/50 rounded-lg max-w-md text-left">
              <p className="font-medium text-primary">{displayUrl}</p>
              <p className="text-sm mt-2">This URL will open in your default browser when you click the button below.</p>
            </div>
          )}
          
          <button
            onClick={handleNavigate}
            disabled={!displayUrl}
            className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-btn hover:bg-primary-container transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    </AppContainer>
  );
};

export default BrowserApp; 