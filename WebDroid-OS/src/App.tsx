import { useState, useEffect } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import DeviceFrame from './components/DeviceFrame';

// Inner component that has access to context
const AppContent = () => {
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [appHistory, setAppHistory] = useState<string[]>([]);
  const [recentAppsList, setRecentAppsList] = useState<string[]>([]);
  const [showRecentsView, setShowRecentsView] = useState<boolean>(false);
  
  // Function to handle removing an app from recents
  const handleRemoveRecentApp = (appIdToRemove: string) => {
    // Remove from recent apps list
    setRecentAppsList(prev => prev.filter(id => id !== appIdToRemove));
  };

  // Function to handle opening an app
  const handleOpenApp = (appId: string) => {
    // Close Recents View if open
    if (showRecentsView) {
      setShowRecentsView(false);
    }
    
    // Update recent apps list - remove app if it exists, then add to front of list
    setRecentAppsList(prev => [appId, ...prev.filter(id => id !== appId)].slice(0, 10));
    
    // Update history and set current app
    if (currentApp) {
      // If opening a different app while one is already open, add to history
      if (currentApp !== appId) {
        setAppHistory(prev => [...prev, appId]);
      }
    } else {
      // First app being opened or opening from recents/home
      setAppHistory([appId]);
    }
    
    setCurrentApp(appId);
  };

  // Function to handle closing an app (Home button logic)
  const handleCloseApp = () => {
    console.log('Home button pressed');
    
    if (currentApp) {
      // Immediately return to home for better user experience
      setCurrentApp(null);
      
      // Close Recents if open
      if (showRecentsView) {
        setShowRecentsView(false);
      }
    } else {
      // Close Recents if open (when no app is active)
      if (showRecentsView) {
        setShowRecentsView(false);
      }
    }
  };

  // Function to handle back navigation
  const handleBackNav = () => {
    console.log('Back button pressed');
    
    // Priority 1: Close Recents View if open
    if (showRecentsView) {
      setShowRecentsView(false);
      return;
    }
    
    // Only proceed if an app is open
    if (currentApp !== null) {
      if (appHistory.length > 1) {
        // Priority 2: Go to previous app
        const newHistory = appHistory.slice(0, -1); // Remove current app
        setAppHistory(newHistory);
        setCurrentApp(newHistory[newHistory.length - 1]); // Set to previous app
      } else if (appHistory.length === 1) {
        // Priority 3: Back from first app goes Home
        setCurrentApp(null); // Go home visually
        setAppHistory([]); // Clear back navigation history
        // DO NOT clear recentAppsList here
      }
    }
    // If currentApp is null (already home) and Recents is closed, Back does nothing
  };

  // Function to handle Recents button
  const handleRecentsClick = () => {
    console.log('Recents button pressed');
    setShowRecentsView(prev => !prev);
  };

  return (
    <DeviceFrame 
      handleOpenApp={handleOpenApp} 
      handleCloseApp={handleCloseApp}
      handleBackNav={handleBackNav}
      handleRecentsClick={handleRecentsClick}
      handleRemoveRecentApp={handleRemoveRecentApp}
      currentApp={currentApp}
      appHistory={appHistory}
      recentAppsList={recentAppsList}
      showRecentsView={showRecentsView}
      hasHistory={currentApp !== null || showRecentsView}
    />
  );
};

function App() {
  return (
    <SettingsProvider>
      <div className="app-root w-full h-full" role="application" aria-label="WebDroid OS Environment">
        <AppContent />
      </div>
    </SettingsProvider>
  );
}

export default App;
