import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  ariaLabel?: string; // For when no visible label is provided
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, ariaLabel }) => {
  // Handle keyboard event for space/enter to toggle
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      {label && <span className="mr-3 text-on-surface dark:text-dark-on-surface">{label}</span>}
      <div 
        className="relative" 
        role={!label ? "switch" : undefined}
        aria-checked={!label ? checked : undefined}
        tabIndex={!label ? 0 : undefined}
        onKeyDown={!label ? handleKeyDown : undefined}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          aria-label={!label ? (ariaLabel || "Toggle switch") : undefined}
          onKeyDown={label ? handleKeyDown : undefined}
        />
        <div 
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${checked ? 'bg-primary dark:bg-dark-primary' : 'bg-surface-dark dark:bg-dark-surface-dark'}
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-dark-surface`}
        />
        <div 
          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          aria-hidden="true"
        />
      </div>
    </label>
  );
};

export default ToggleSwitch; 