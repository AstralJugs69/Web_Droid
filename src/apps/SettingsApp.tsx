import React, { useState } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';

// Import sub-page components
import DisplaySettingsPage from './SettingsApp/DisplaySettingsPage';
import SoundSettingsPage from './SettingsApp/SoundSettingsPage';
import AboutSettingsPage from './SettingsApp/AboutSettingsPage';
import NotesSettingsPage from './SettingsApp/NotesSettingsPage';
import WeatherSettingsPage from './SettingsApp/WeatherSettingsPage';
import GameSettingsPage from './SettingsApp/GameSettingsPage';
import BrowserSettingsPage from './SettingsApp/BrowserSettingsPage';
import NetworkSettingsPage from './SettingsApp/NetworkSettingsPage';
import StorageSettingsPage from './SettingsApp/StorageSettingsPage';
import SystemSettingsPage from './SettingsApp/SystemSettingsPage';
import LockSettingsPage from './SettingsApp/LockSettingsPage';

interface SettingsAppProps {
  closeApp: () => void;
}

type SettingsView = 
  'main' | 
  'display' | 
  'sound' | 
  'about' | 
  'notesSettings' | 
  'weatherSettings' | 
  'gameSettings' | 
  'browserSettings' |
  'networkSettings' |
  'storageSettings' |
  'systemSettings' |
  'lockSettings';

const SettingsApp: React.FC<SettingsAppProps> = ({ }) => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const { playSound } = useSound();

  // Navigate to a settings category with animation
  const navigateToView = (view: SettingsView) => {
    playSound('/sounds/click.mp3', 0.2);
    setIsTransitioning(true);
    
    // Short delay for exit animation
    setTimeout(() => {
      setCurrentView(view);
      
      // Reset transition state after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  // Navigate back to main settings
  const navigateToMain = () => {
    playSound('/sounds/click.mp3', 0.2);
    setIsTransitioning(true);
    
    // Short delay for exit animation
    setTimeout(() => {
      setCurrentView('main');
      
      // Reset transition state after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  // Create app bar content
  const renderAppBar = () => {
    let title = 'Settings';
    
    switch (currentView) {
      case 'display': title = 'Display'; break;
      case 'sound': title = 'Sound'; break;
      case 'about': title = 'About'; break;
      case 'notesSettings': title = 'Notes Settings'; break;
      case 'weatherSettings': title = 'Weather Settings'; break;
      case 'gameSettings': title = 'Game Settings'; break;
      case 'browserSettings': title = 'Browser Settings'; break;
      case 'networkSettings': title = 'Network & Internet'; break;
      case 'storageSettings': title = 'Storage'; break;
      case 'systemSettings': title = 'System'; break;
      case 'lockSettings': title = 'Security & Lock Screen'; break;
    }
    
    return (
      <div className="flex items-center justify-between w-full">
        {currentView !== 'main' && (
          <button
            onClick={navigateToMain}
            className="p-2 rounded-btn mr-2 text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Back to Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-semibold text-on-surface font-sans">
          <span className="relative inline-block">
            <span className="invisible">{title}</span>
            <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">{title}</span>
          </span>
        </h1>
        <div className={currentView !== 'main' ? 'w-8' : ''}></div> {/* Spacer for alignment */}
      </div>
    );
  };

  // Settings list item component
  const SettingsItem = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
    <div 
      className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-surface-variant/50 transition-colors duration-150 active:bg-surface-variant/70"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-6 h-6 mr-4 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="font-medium text-on-surface font-sans">{title}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-on-surface-variant">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );

  // Section header component
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-3">
      <h2 className="text-xs uppercase font-bold tracking-wide text-secondary/70 font-sans">{title}</h2>
    </div>
  );

  // Render the main settings list
  const renderMainSettings = () => (
    <div className="divide-y divide-outline-variant/10">
      {/* System Settings */}
      <SectionHeader title="System" />
      
      {/* Network & Internet Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        }
        title="Network & Internet (Simulated)"
        onClick={() => navigateToView('networkSettings')}
      />

      {/* Security & Lock Screen */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
        title="Security & Lock Screen"
        onClick={() => navigateToView('lockSettings')}
      />

      {/* Storage Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="6" y1="10" x2="6" y2="10" />
            <line x1="10" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="14" y2="10" />
            <line x1="18" y1="10" x2="18" y2="10" />
          </svg>
        }
        title="Storage (Simulated)"
        onClick={() => navigateToView('storageSettings')}
      />

      {/* Display Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        }
        title="Display"
        onClick={() => navigateToView('display')}
      />

      {/* Sound Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        }
        title="Sound & Vibration"
        onClick={() => navigateToView('sound')}
      />

      {/* System Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        }
        title="System"
        onClick={() => navigateToView('systemSettings')}
      />

      {/* Applications Section Header */}
      <SectionHeader title="Applications" />

      {/* Notes Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M4 12h16" />
            <path d="M4 18h16" />
            <path d="M4 6h16" />
          </svg>
        }
        title="Notes"
        onClick={() => navigateToView('notesSettings')}
      />

      {/* Weather Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M8 5.07A2.93 2.93 0 0 1 7 2a3 3 0 0 1 5 0 2.93 2.93 0 0 1-1 3.07" />
            <path d="M5 9a3 3 0 1 1 0 6h13a3 3 0 0 0 0-6s-3.67 1-5.5-1" />
          </svg>
        }
        title="Weather"
        onClick={() => navigateToView('weatherSettings')}
      />

      {/* Game Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        }
        title="Game"
        onClick={() => navigateToView('gameSettings')}
      />

      {/* Browser Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        }
        title="Browser"
        onClick={() => navigateToView('browserSettings')}
      />

      {/* System Info Section */}
      <SectionHeader title="System Info" />

      {/* About Settings */}
      <SettingsItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        }
        title="About Device"
        onClick={() => navigateToView('about')}
      />
    </div>
  );

  return (
    <AppContainer
      appId="settings"
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className="h-full bg-surface text-on-surface">
        <div 
          id="app-content-area" 
          className={`h-full overflow-auto transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {currentView === 'main' && renderMainSettings()}
          {currentView === 'display' && <DisplaySettingsPage />}
          {currentView === 'sound' && <SoundSettingsPage />}
          {currentView === 'about' && <AboutSettingsPage />}
          {currentView === 'notesSettings' && <NotesSettingsPage />}
          {currentView === 'weatherSettings' && <WeatherSettingsPage />}
          {currentView === 'gameSettings' && <GameSettingsPage />}
          {currentView === 'browserSettings' && <BrowserSettingsPage />}
          {currentView === 'networkSettings' && <NetworkSettingsPage />}
          {currentView === 'storageSettings' && <StorageSettingsPage />}
          {currentView === 'systemSettings' && <SystemSettingsPage />}
          {currentView === 'lockSettings' && <LockSettingsPage onBack={() => navigateToMain()} />}
        </div>
      </div>
    </AppContainer>
  );
};

export default SettingsApp; 