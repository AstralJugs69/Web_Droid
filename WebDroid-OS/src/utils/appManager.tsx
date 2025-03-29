import React from 'react';
import AppContainer from '../components/AppContainer';

// Import all apps
import CalculatorApp from '../apps/CalculatorApp';
import NotesApp from '../apps/NotesApp';
import WeatherApp from '../apps/WeatherApp';
import CameraApp from '../apps/CameraApp';
import BrowserApp from '../apps/BrowserApp';
import FileExplorerApp from '../apps/FileExplorerApp';
import SettingsApp from '../apps/SettingsApp';
import ThemesApp from '../apps/ThemesApp';
import ClockApp from '../apps/ClockApp/index';

/**
 * Renders a specific app component based on the app ID
 * @param appId The ID of the app to render
 * @param closeApp Function to call when the app should be closed
 * @returns The app component
 */
export const getAppComponent = (
  appId: string, 
  closeApp: () => void
) => {
  // Common props to pass to app components
  const appProps: any = {
    closeApp
  };
  
  try {
    switch (appId.toLowerCase()) {
      case 'calculator':
        return <CalculatorApp {...appProps} />;
      case 'notes':
        return <NotesApp {...appProps} />;
      case 'weather':
        return <WeatherApp {...appProps} />;
      case 'camera':
        return <CameraApp {...appProps} />;
      case 'browser':
        return <BrowserApp {...appProps} />;
      case 'files':
        return <FileExplorerApp {...appProps} />;
      case 'themes':
        return <ThemesApp {...appProps} />;
      case 'settings':
        return <SettingsApp {...appProps} />;
      case 'clock':
        return <ClockApp {...appProps} />;
      default:
        console.error(`App with ID "${appId}" not found.`);
        return (
          <div className="flex h-full w-full items-center justify-center text-on-surface bg-surface">
            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-2">App Not Found</h2>
              <p>The app "{appId}" does not exist or is not available.</p>
            </div>
          </div>
        );
    }
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-red-500/20 p-4 rounded">
          <h1 className="text-xl font-bold mb-2">Error Loading App</h1>
          <p className="mb-2">There was an error loading the app: {appId}</p>
          <p className="text-sm">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    );
  }
};

/**
 * Renders a collection of apps with persistent state, controlling visibility based on the current app
 * @param activeAppsList List of apps to render (should be recentAppsList or similar)
 * @param currentApp The currently active app ID
 * @param closeApp Function to close the active app
 * @returns An array of rendered app components wrapped in containers
 */
export const renderPersistentApps = (
  activeAppsList: string[],
  currentApp: string | null,
  closeApp: () => void
) => {
  // Limit the number of concurrently rendered apps for performance
  const MAX_PERSISTENT_APPS = 5;
  
  // Ensure current app is included, even if not in activeAppsList
  const appsToRender = currentApp 
    ? [currentApp, ...activeAppsList.filter(id => id !== currentApp)]
    : [...activeAppsList];
  
  // Limit to MAX_PERSISTENT_APPS
  const limitedAppsList = appsToRender.slice(0, MAX_PERSISTENT_APPS);
  
  return limitedAppsList.map(appId => {
    const isActive = appId === currentApp;
    
    return (
      <div 
        key={`app-wrapper-${appId}`}
        className={`absolute inset-0 transition-opacity duration-300 ${
          isActive 
            ? 'opacity-100 pointer-events-auto z-30' 
            : 'opacity-0 pointer-events-none z-10'
        }`}
      >
        <AppContainer appId={appId}>
          {getAppComponent(appId, closeApp)}
        </AppContainer>
      </div>
    );
  });
};

// Track which apps are visibly active
const visibleApps = new Set<string>();

export const isAppVisible = (appId: string): boolean => {
  return visibleApps.has(appId);
};

export const setAppVisibility = (appId: string, isVisible: boolean): void => {
  if (isVisible) {
    visibleApps.add(appId);
  } else {
    visibleApps.delete(appId);
  }
};

export const clearAllVisibleApps = (): void => {
  visibleApps.clear();
}; 