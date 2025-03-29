import React from 'react';

type DeviceType = 'phone' | 'tablet';

interface DeviceTypeToggleButtonProps {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  type: DeviceType;
}

const DeviceTypeToggleButton: React.FC<DeviceTypeToggleButtonProps> = ({ 
  deviceType, 
  setDeviceType, 
  type 
}) => {
  const isActive = deviceType === type;
  
  return (
    <button
      onClick={() => setDeviceType(type)}
      className={`px-3 py-1 rounded-btn transition-colors duration-200 ${
        isActive 
          ? 'bg-primary text-on-primary' 
          : 'bg-surface-variant dark:bg-surface-variant text-on-surface dark:text-on-surface hover:bg-surface-light dark:hover:bg-surface-dark'
      }`}
    >
      {type === 'phone' ? 'Phone' : 'Tablet'}
    </button>
  );
};

export default DeviceTypeToggleButton; 