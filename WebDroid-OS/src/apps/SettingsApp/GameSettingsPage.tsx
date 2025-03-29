import React from 'react';

const GameSettingsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-surface dark:bg-dark-surface-light/5 rounded-lg p-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Game Settings
        </h3>
        
        <div className="flex flex-col space-y-2">
          <p className="text-on-surface dark:text-dark-on-surface">
            This page will contain settings for the GeoAssault game.
          </p>
          <p className="text-secondary dark:text-dark-secondary text-sm">
            Future features may include:
          </p>
          <ul className="list-disc pl-5 text-secondary dark:text-dark-secondary text-sm space-y-1">
            <li>Difficulty settings</li>
            <li>Controller preferences</li>
            <li>Graphics quality options</li>
            <li>Sound effect volume</li>
            <li>Game statistics and achievements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsPage; 