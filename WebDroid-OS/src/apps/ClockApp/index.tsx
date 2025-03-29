import React, { useState } from 'react';
import AppContainer from '../../components/AppContainer';
import WorldClockTab from './WorldClockTab';
import AlarmTab from './AlarmTab';
import StopwatchTab from './StopwatchTab';
import TimerTab from './TimerTab';
import DigitalClockDisplay from './DigitalClockDisplay';

interface ClockAppProps {
  closeApp: () => void;
}

type TabId = 'clock' | 'alarm' | 'stopwatch' | 'timer';

interface TabConfig {
  id: TabId;
  label: string;
  icon: JSX.Element;
}

const ClockApp: React.FC<ClockAppProps> = ({ closeApp }) => {
  const [activeTab, setActiveTab] = useState<TabId>('clock');

  // Tab configuration with icons
  const tabs: TabConfig[] = [
    {
      id: 'clock',
      label: 'Clock',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 'alarm',
      label: 'Alarm',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      id: 'stopwatch',
      label: 'Stopwatch',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      id: 'timer',
      label: 'Timer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // App bar content
  const renderAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium text-on-surface font-sans">
          <span className="relative inline-block">
            <span className="invisible">Clock</span>
            <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">Clock</span>
          </span>
        </h1>
        <div className="flex items-center">
          {activeTab === 'alarm' && (
            <button 
              className="p-2 rounded-full hover:bg-surface-variant/50 active:bg-surface-variant/70 transition-colors"
              aria-label="Add Alarm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Tab bar component
  const TabBar = () => {
    return (
      <div className="flex justify-around items-center h-14 border-t border-outline-variant bg-surface text-on-surface-variant">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center px-1 h-full transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant'
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            aria-selected={activeTab === tab.id}
          >
            <div className="w-5 h-5 mb-1">{tab.icon}</div>
            <span className="text-[10px] truncate max-w-full">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'clock':
        return <DigitalClockDisplay />;
      case 'alarm':
        return <AlarmTab />;
      case 'stopwatch':
        return <StopwatchTab />;
      case 'timer':
        return <TimerTab />;
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <AppContainer
      appId="clock"
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className="w-full h-full flex flex-col bg-page-background">
        <div className="flex-grow overflow-hidden">
          {renderContent()}
        </div>
        <TabBar />
      </div>
    </AppContainer>
  );
};

export default ClockApp; 