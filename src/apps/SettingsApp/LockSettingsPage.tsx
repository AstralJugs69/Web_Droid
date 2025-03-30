import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import ToggleSwitch from '../../components/ToggleSwitch';
import ChangePinModal from './ChangePinModal';

interface LockSettingsPageProps {
  onBack: () => void;
}

const LockSettingsPage: React.FC<LockSettingsPageProps> = ({ onBack }) => {
  const { lockscreenPin, setLockscreenPin } = useSettings();
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);

  // Handle toggling PIN lock on/off
  const handleTogglePin = () => {
    if (lockscreenPin) {
      // PIN is currently enabled, confirm before disabling
      const confirmDisable = window.confirm("Disable screen lock? Your device will no longer be protected.");
      
      if (confirmDisable) {
        setLockscreenPin(null);
      }
    } else {
      // PIN is disabled, open modal to set a new one
      setIsChangePinModalOpen(true);
    }
  };

  // Handle changing PIN - open the modal
  const handleChangePin = () => {
    setIsChangePinModalOpen(true);
  };

  // Handle PIN submission from the modal
  const handlePinSubmit = (newPin: string): boolean => {
    // Set the new PIN
    setLockscreenPin(newPin);
    return true;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-3 p-1.5 rounded-full hover:bg-surface-variant/50 active:bg-surface-variant/70 transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-xl font-medium text-on-surface">Security & Lock Screen</h1>
      </div>

      {/* PIN Status */}
      <div className="bg-surface-container p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-on-surface">Screen Lock</h2>
            <p className="text-sm text-on-surface-variant">
              {lockscreenPin ? "PIN enabled" : "Disabled"}
            </p>
          </div>
          
          {/* Toggle Switch - replaced with ToggleSwitch component */}
          <ToggleSwitch 
            checked={lockscreenPin !== null}
            onChange={handleTogglePin}
            ariaLabel="PIN Lock Enabled"
          />
        </div>

        {/* Change PIN Button - only show if PIN is enabled */}
        {lockscreenPin && (
          <button
            onClick={handleChangePin}
            className="w-full bg-surface-variant hover:bg-surface-variant/80 text-on-surface-variant py-2 px-4 rounded-lg transition-colors"
          >
            Change PIN
          </button>
        )}
      </div>

      {/* Security Information */}
      <div className="bg-surface-container p-4 rounded-lg">
        <h2 className="text-lg font-medium text-on-surface mb-2">Security Information</h2>
        <p className="text-sm text-on-surface-variant">
          Using a PIN helps protect your device from unauthorized access.
        </p>
      </div>

      {/* Change PIN Modal */}
      <ChangePinModal 
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
        onSubmitPin={handlePinSubmit}
        requiresOldPin={lockscreenPin !== null}
        currentPin={lockscreenPin || undefined}
      />
    </div>
  );
};

export default LockSettingsPage; 