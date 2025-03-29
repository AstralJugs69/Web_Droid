import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';

// App configuration array with emoji icons
const appsConfig = [
  { 
    id: 'calculator', 
    name: 'Calculator', 
    icon: '🧮'
  },
  { 
    id: 'weather', 
    name: 'Weather', 
    icon: '🌦️'
  },
  { 
    id: 'notes', 
    name: 'Notes', 
    icon: '📝'
  },
  { 
    id: 'camera', 
    name: 'Camera', 
    icon: '📸'
  },
  { 
    id: 'browser', 
    name: 'Browser', 
    icon: '🌐'
  },
  { 
    id: 'clock', 
    name: 'Clock', 
    icon: '⏰'
  },
  { 
    id: 'files', 
    name: 'Files', 
    icon: '📁'
  },
  { 
    id: 'themes', 
    name: 'Themes', 
    icon: '🎨'
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: '⚙️'
  },
];

interface HomeScreenProps {
  onOpenApp: (appId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp }) => {
  const { deviceType } = useSettings();
  const { playSound } = useSound();
  
  // Handle app launch with sound
  const handleAppLaunch = (appId: string) => {
    playSound('/sounds/click.mp3', 0.3);
    onOpenApp(appId);
  };
  
  // Choose grid columns and other responsive values based on device type
  const gridColumns = deviceType === 'tablet' ? 'grid-cols-4' : 'grid-cols-3';
  const iconSize = deviceType === 'tablet' ? 'w-16 h-16' : 'w-14 h-14';
  const iconFontSize = deviceType === 'tablet' ? 'text-5xl' : 'text-4xl';
  const gridGap = deviceType === 'tablet' ? 'gap-6' : 'gap-4';
  
  return (
    <div className="absolute inset-0 z-30 overflow-y-auto bg-surface/5">
      {/* True Grid Layout */}
      <div className={`grid ${gridColumns} ${gridGap} p-6 pt-8 pb-24 mx-auto`}>
        {appsConfig.map((app) => (
          <div 
            key={app.id} 
            className="group flex flex-col items-center justify-center p-3 rounded transition-all duration-300 hover:bg-surface/20"
            onClick={() => handleAppLaunch(app.id)}
          >
            {/* Icon container with enhanced hover effects */}
            <div 
              className={`flex justify-center items-center ${iconSize} mb-2 rounded-xl 
                         bg-gradient-to-br from-surface-light to-surface
                         shadow-sm
                         group-hover:shadow-md group-hover:shadow-primary/20
                         group-hover:scale-105 group-active:scale-95
                         transition-all duration-300 ease-out
                         group-hover:bg-gradient-to-r group-hover:from-primary/10 group-hover:to-accent/10`}
            >
              <span className={iconFontSize}>{app.icon}</span>
            </div>
            
            {/* App name with subtle hover effect */}
            <span 
              className="text-on-surface font-medium text-sm text-center
                         transition-all duration-300
                         group-hover:text-primary font-sans"
            >
              {app.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen; 