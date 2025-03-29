import React from 'react';
import '../styles/RecentsView.css';
import { useSettings } from '../contexts/SettingsContext';

interface RecentsViewProps {
  recentAppsList: string[];
  currentApp: string | null;
  onSelectApp: (appId: string) => void;
  onRemoveApp: (appId: string) => void;
}

// The RecentsView component displays a stack of app cards
const RecentsView: React.FC<RecentsViewProps> = ({
  recentAppsList,
  currentApp,
  onSelectApp,
  onRemoveApp
}) => {
  const { deviceType } = useSettings();
  
  // Match the styling of the device screen based on device type
  const deviceScreenClasses = deviceType === 'phone'
    ? "aspect-[9/19] h-full rounded-xl overflow-hidden"
    : "aspect-[4/3] h-full rounded-xl overflow-hidden";
  
  // Function to render app card content based on app ID
  const renderAppContent = (appId: string) => {
    // Simple styled cards based on app type
    switch (appId) {
      case 'calculator':
        return (
          <div className="flex items-center justify-center h-full bg-surface/90 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Calculator</div>
              <div className="text-sm text-on-surface-variant">Basic calculator</div>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="flex items-center justify-center h-full bg-yellow-50 dark:bg-yellow-900/30 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Notes</div>
              <div className="text-sm text-on-surface-variant">Text notes</div>
            </div>
          </div>
        );
      
      case 'weather':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-800 dark:to-blue-950 p-4 text-on-primary">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Weather</div>
              <div className="text-sm text-on-primary opacity-80">Weather information</div>
            </div>
          </div>
        );
      
      case 'browser':
        return (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Browser</div>
              <div className="text-sm text-on-surface-variant">Web browser</div>
            </div>
          </div>
        );
          
      case 'files':
        return (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Files</div>
              <div className="text-sm text-on-surface-variant">File explorer</div>
            </div>
          </div>
        );
          
      case 'camera':
        return (
          <div className="flex items-center justify-center h-full bg-black text-white p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Camera</div>
              <div className="text-sm opacity-80">Take photos</div>
            </div>
          </div>
        );
          
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">Settings</div>
              <div className="text-sm text-on-surface-variant">App settings</div>
            </div>
          </div>
        );
          
      default:
        // For unknown app types, show a basic preview with the app name
        return (
          <div className="flex items-center justify-center h-full bg-surface/90 p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-1">{appId}</div>
              <div className="text-sm text-on-surface-variant">App preview</div>
            </div>
          </div>
        );
    }
  };
    
  return (
    <div className={`absolute inset-0 z-40 bg-scrim/80 backdrop-blur-md ${deviceScreenClasses} flex flex-col items-center pt-12 pb-20`}>
      <div className="text-center mb-4">
        <h2 className="text-on-scrim text-xl font-medium mb-2">Recent Apps</h2>
        <p className="text-on-scrim/70 text-sm">Swipe through your recent apps</p>
      </div>
      
      {/* Scrollable cards container */}
      <div className="recents-scroll w-full max-w-md mx-auto h-[75vh] overflow-y-auto relative px-4">
        {recentAppsList.length > 0 ? (
          <div className="pt-32 pb-32 relative flex flex-col items-center">
            {recentAppsList.map((appId, index) => {
              const isActive = appId === currentApp;
              
              // Calculate progressive scaling and offset for the card stack effect
              const scale = 1 - (index * 0.05);
              const offset = index * 20;
              
              return (
                <div
                  key={`app-card-${appId}`}
                  onClick={() => onSelectApp(appId)}
                  className={`recent-app-card relative mb-4 w-full max-w-md bg-surface rounded-xl shadow-xl 
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer
                    ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  style={{
                    zIndex: 1000 - index,
                    transform: `scale(${scale}) translateY(-${offset}px)`,
                  }}
                >
                  <div className="p-2">
                    <button
                      aria-label={`Close ${appId} app`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveApp(appId);
                      }}
                      className="absolute top-2 right-2 z-10 p-1 bg-scrim/50 text-on-scrim rounded-full hover:bg-scrim active:scale-95 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="app-card-content rounded-lg overflow-hidden aspect-[4/3] shadow-inner">
                      {renderAppContent(appId)}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 px-1">
                      <div className="text-sm font-medium text-on-surface">
                        {appId.charAt(0).toUpperCase() + appId.slice(1)}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {/* Simple timestamp indicator without using actual timestamps */}
                        {index === 0 ? 'Just now' : `${index + 1}m ago`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-on-scrim p-4">
              <p className="text-xl font-semibold mb-2">No Recent Apps</p>
              <p className="text-sm opacity-80">Open some apps to see them here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentsView; 