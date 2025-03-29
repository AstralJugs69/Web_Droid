import React from 'react';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../contexts/SettingsContext';
import { useSound } from '../../hooks/useSound';

const DisplaySettingsPage: React.FC = () => {
  const { 
    deviceType, setDeviceType
  } = useSettings();
  const { playSound } = useSound();

  const toggleDeviceType = () => {
    setDeviceType(deviceType === 'phone' ? 'tablet' : 'phone');
  };

  return (
    <div className="divide-y divide-outline-variant/10">
      {/* Device Settings */}
      <div className="py-2">
        <div className="px-4 py-3">
          <h2 className="text-xs uppercase font-bold tracking-wide text-secondary/70 font-sans">Device</h2>
        </div>
        
        {/* Device Type Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-4 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                {deviceType === 'phone' ? (
                  <>
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </>
                ) : (
                  <>
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                    <rect x="9" y="1" width="6" height="3" rx="1" ry="1" />
                    <line x1="12" y1="20" x2="12" y2="20" />
                  </>
                )}
              </svg>
            </div>
            <span className="font-medium text-on-surface font-sans">
              {deviceType === 'phone' ? 'Phone Layout' : 'Tablet Layout'}
            </span>
          </div>
          <ToggleSwitch 
            checked={deviceType === 'tablet'}
            onChange={toggleDeviceType}
          />
        </div>
      </div>
      
      <div className="py-4 px-4 text-center">
        <p className="text-on-surface-variant font-sans text-sm">
          Theme and wallpaper settings have been moved to the Themes app.
        </p>
      </div>
    </div>
  );
};

export default DisplaySettingsPage; 