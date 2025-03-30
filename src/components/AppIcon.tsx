import React from 'react';

interface AppIconProps {
  appName: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ appName, icon, onClick }) => {
  return (
    <div 
      className="flex sm:flex-col items-center sm:items-center cursor-pointer w-full py-3 px-2 sm:p-3 hover:bg-surface/10 active:bg-surface/20 transition-colors duration-150 rounded sm:rounded"
      onClick={onClick}
    >
      <div className="w-10 h-10 sm:w-14 sm:h-14 mr-4 sm:mr-0 sm:mb-3 rounded bg-gradient-to-br from-surface-light to-surface flex items-center justify-center shadow-sm">
        <div className="text-lg sm:text-xl">
          {icon}
        </div>
      </div>
      <span className="text-sm font-medium text-on-surface sm:text-center font-sans">
        {appName}
      </span>
    </div>
  );
};

export default AppIcon; 