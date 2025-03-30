import React from 'react';

const SystemSettingsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          System Settings
        </h3>
        <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="text-on-surface dark:text-dark-on-surface">
              This is a placeholder for advanced system settings and configurations.
            </div>
            
            <div className="text-sm text-secondary dark:text-dark-secondary space-y-1">
              <p>Future system settings would include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Developer options</li>
                <li>Backup and restore</li>
                <li>System updates</li>
                <li>Performance optimization</li>
                <li>Advanced display settings</li>
                <li>Security features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          System Information
        </h3>
        <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg divide-y divide-surface-dark/10 dark:divide-dark-surface-light/10">
          <div className="flex justify-between items-center p-4">
            <span className="text-secondary dark:text-dark-secondary">OS Version</span>
            <span className="text-on-surface dark:text-dark-on-surface font-medium">WebDroid OS 1.0</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <span className="text-secondary dark:text-dark-secondary">Build Number</span>
            <span className="text-on-surface dark:text-dark-on-surface font-medium">WD.2023.0001.A</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <span className="text-secondary dark:text-dark-secondary">Last Update</span>
            <span className="text-on-surface dark:text-dark-on-surface font-medium">Today</span>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <span className="text-secondary dark:text-dark-secondary">Device Type</span>
            <span className="text-on-surface dark:text-dark-on-surface font-medium">WebDroid Portfolio</span>
          </div>
        </div>
      </div>
      
      <div className="pb-4">
        <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 3v4" />
                <path d="M18 6l-2 2" />
                <path d="M6 6l2 2" />
                <path d="M12 17v4" />
                <path d="M18 18l-2-2" />
                <path d="M6 18l2-2" />
                <path d="M3 12h4" />
                <path d="M17 12h4" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <span className="text-on-surface dark:text-dark-on-surface font-medium">System is up to date</span>
            <span className="text-xs text-secondary dark:text-dark-secondary">All systems operating normally</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage; 