import React from 'react';

const StorageSettingsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Storage Overview
        </h3>
        <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="text-on-surface dark:text-dark-on-surface font-medium">
              Storage Usage (Simulated)
            </div>
            
            {/* Visual storage bar */}
            <div className="w-full h-4 bg-surface-dark/10 dark:bg-dark-surface-light/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary dark:bg-dark-primary rounded-full" style={{ width: '65%' }}></div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-secondary dark:text-dark-secondary">
              <span>16.8 GB used</span>
              <span>12.2 GB free</span>
            </div>
            
            {/* Storage breakdown */}
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-on-surface dark:text-dark-on-surface">Apps</span>
                </div>
                <span className="text-secondary dark:text-dark-secondary">8.4 GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                  <span className="text-on-surface dark:text-dark-on-surface">Media</span>
                </div>
                <span className="text-secondary dark:text-dark-secondary">5.3 GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-error mr-2"></div>
                  <span className="text-on-surface dark:text-dark-on-surface">System</span>
                </div>
                <span className="text-secondary dark:text-dark-secondary">2.1 GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-surface-dark mr-2"></div>
                  <span className="text-on-surface dark:text-dark-on-surface">Other</span>
                </div>
                <span className="text-secondary dark:text-dark-secondary">1.0 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Storage Management
        </h3>
        <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg p-4">
          <div className="text-sm text-secondary dark:text-dark-secondary space-y-1">
            <p>In a real device, this section would include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Storage cleanup recommendations</li>
              <li>Cached data management</li>
              <li>App storage details</li>
              <li>External storage options</li>
              <li>File system management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageSettingsPage; 