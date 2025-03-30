import React from 'react';

const AboutSettingsPage: React.FC = () => {
  // Generate dynamic build timestamp
  const buildTimestamp = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-surface-variant/10 rounded-btn p-4 border border-outline-variant/20">
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {/* Model Name */}
          <div className="flex justify-between py-2">
            <span className="text-on-surface-variant font-sans">Model Name</span>
            <span className="text-on-surface font-medium font-sans">WebDroid OS Virtual Device</span>
          </div>
          
          {/* Version */}
          <div className="flex justify-between py-2">
            <span className="text-on-surface-variant font-sans">Version</span>
            <span className="text-on-surface font-medium font-sans">1.0.0</span>
          </div>
          
          {/* Build Info */}
          <div className="flex justify-between py-2">
            <span className="text-on-surface-variant font-sans">Build Info</span>
            <span className="text-on-surface font-medium font-sans">Build {buildTimestamp}</span>
          </div>
          
          {/* Developer */}
          <div className="flex justify-between py-2">
            <span className="text-on-surface-variant font-sans">Developer</span>
            <span className="text-on-surface font-medium font-sans">WebDroid Team</span>
          </div>
        </div>
      </div>
      
      {/* GitHub/Portfolio Link */}
      <div className="mt-4 text-center">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-sans"
        >
          View on GitHub
        </a>
      </div>
      
      {/* Legal Info */}
      <div className="mt-6 text-sm text-on-surface-variant text-center font-sans">
        <p>WebDroid OS is a demonstration project.</p>
        <p className="mt-1">© {new Date().getFullYear()} WebDroid OS</p>
      </div>
    </div>
  );
};

export default AboutSettingsPage; 