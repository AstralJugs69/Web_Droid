import React, { useState } from 'react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPin: (newPin: string) => boolean;
  requiresOldPin: boolean;
  currentPin?: string;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  onClose,
  onSubmitPin,
  requiresOldPin,
  currentPin
}) => {
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // Clear any previous error
    setErrorMessage('');

    // Validate if old PIN is required
    if (requiresOldPin) {
      if (!oldPinInput) {
        setErrorMessage('Please enter your current PIN');
        return;
      }
      
      if (oldPinInput !== currentPin) {
        setErrorMessage('Current PIN is incorrect');
        return;
      }
    }

    // Validate new PIN
    if (!newPinInput) {
      setErrorMessage('Please enter a new PIN');
      return;
    }

    if (!/^\d{4}$/.test(newPinInput)) {
      setErrorMessage('PIN must be exactly 4 digits');
      return;
    }

    // Validate confirmation matches
    if (newPinInput !== confirmPinInput) {
      setErrorMessage('PINs don\'t match');
      return;
    }

    // Submit the new PIN
    const success = onSubmitPin(newPinInput);
    
    if (success) {
      onClose();
    } else {
      setErrorMessage('Failed to update PIN');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/50 backdrop-blur-sm">
      <div 
        className="bg-surface rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-medium text-on-surface mb-4">
          {requiresOldPin ? "Change PIN" : "Set New PIN"}
        </h3>
        
        <div className="space-y-4">
          {/* Current PIN input - only when required */}
          {requiresOldPin && (
            <div>
              <label 
                htmlFor="current-pin" 
                className="block text-sm font-medium text-on-surface-variant mb-1"
              >
                Current PIN
              </label>
              <input
                id="current-pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3 py-2 bg-surface-variant/30 border border-outline-variant rounded-md 
                           text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none 
                           focus:ring-2 focus:ring-primary/50"
                placeholder="Enter current PIN"
              />
            </div>
          )}
          
          {/* New PIN input */}
          <div>
            <label 
              htmlFor="new-pin" 
              className="block text-sm font-medium text-on-surface-variant mb-1"
            >
              New PIN
            </label>
            <input
              id="new-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-3 py-2 bg-surface-variant/30 border border-outline-variant rounded-md 
                         text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none 
                         focus:ring-2 focus:ring-primary/50"
              placeholder="Enter 4-digit PIN"
            />
          </div>
          
          {/* Confirm PIN input */}
          <div>
            <label 
              htmlFor="confirm-pin" 
              className="block text-sm font-medium text-on-surface-variant mb-1"
            >
              Confirm PIN
            </label>
            <input
              id="confirm-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-3 py-2 bg-surface-variant/30 border border-outline-variant rounded-md 
                         text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none 
                         focus:ring-2 focus:ring-primary/50"
              placeholder="Confirm new PIN"
            />
          </div>
          
          {/* Error message */}
          {errorMessage && (
            <p className="text-error text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 border border-outline-variant rounded-md text-on-surface 
                       hover:bg-surface-variant/50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-on-primary rounded-md 
                       hover:bg-primary-dark transition-colors"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePinModal; 