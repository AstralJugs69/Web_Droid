import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

// Define the Alarm type
interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

// Simple modal for adding alarms
interface AddAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string, label: string) => void;
}

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const { playSound } = useSound();

  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setTime('');
      setLabel('');
      setError('');
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = () => {
    playSound('/sounds/click.mp3', 0.3);
    
    // Basic validation
    if (!time) {
      setError('Please enter a valid time');
      return;
    }

    // Validate time format (very basic check)
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
    if (!timeRegex.test(time)) {
      setError('Please enter time in format: HH:MM AM/PM');
      return;
    }

    // Validate that time is more than 2 hours in the future
    const [timePart, ampm] = time.split(/\s+/);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    const now = new Date();
    const alarmTime = new Date();
    
    // Set the alarm time
    let alarmHours = hours;
    if (ampm.toUpperCase() === 'PM' && hours < 12) {
      alarmHours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
      alarmHours = 0;
    }
    
    alarmTime.setHours(alarmHours, minutes, 0, 0);
    
    // If alarm time is earlier today, set it for tomorrow
    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    // Check if alarm is at least 2 hours in the future
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (alarmTime < twoHoursFromNow) {
      setError('Alarm must be set at least 2 hours in the future');
      playSound('/sounds/error.mp3', 0.3);
      return;
    }
    
    // Save the alarm
    onSave(time, label || 'Alarm');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-scrim/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-xl font-medium text-on-surface mb-4">Add Alarm</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-on-surface-variant mb-1">
              Time (HH:MM AM/PM)
            </label>
            <input
              id="time"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 7:30 AM"
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
            />
          </div>
          
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-on-surface-variant mb-1">
              Label (optional)
            </label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Morning Alarm"
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
            />
          </div>
          
          {error && (
            <p className="text-error text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-md hover:bg-surface-variant/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AlarmTab: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    // Try to get saved alarms from localStorage
    try {
      const savedAlarms = localStorage.getItem('webdroid-alarms');
      return savedAlarms ? JSON.parse(savedAlarms) : [];
    } catch (error) {
      console.error('Error loading alarms from localStorage:', error);
      return [];
    }
  });
  
  const [showAddAlarmModal, setShowAddAlarmModal] = useState(false);
  const { playSound } = useSound();

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('webdroid-alarms', JSON.stringify(alarms));
    } catch (error) {
      console.error('Error saving alarms to localStorage:', error);
    }
  }, [alarms]);

  // Toggle alarm enabled state
  const handleToggleAlarm = (id: string) => {
    playSound('/sounds/click.mp3', 0.3);
    setAlarms(prevAlarms => 
      prevAlarms.map(alarm => 
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  // Add a new alarm
  const handleAddAlarm = (time: string, label: string) => {
    playSound('/sounds/confirm.mp3', 0.4);
    const newAlarm: Alarm = {
      id: `alarm-${Date.now()}`,
      time,
      label,
      enabled: true
    };
    
    setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
  };

  // Delete an alarm
  const handleDeleteAlarm = (id: string) => {
    playSound('/sounds/click.mp3', 0.3);
    
    if (window.confirm('Delete this alarm?')) {
      setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
      playSound('/sounds/error.mp3', 0.3);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="overflow-y-auto flex-1 pb-24">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-on-surface-variant">No alarms set. Add an alarm to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {alarms.map(alarm => (
              <div key={alarm.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-3xl text-on-surface font-light">{alarm.time}</div>
                    <div className="text-sm text-on-surface-variant">{alarm.label}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Toggle switch (simplified for now) */}
                    <button
                      onClick={() => handleToggleAlarm(alarm.id)}
                      className={`w-12 h-6 rounded-full relative ${
                        alarm.enabled ? 'bg-primary' : 'bg-surface-variant'
                      } transition-colors duration-200`}
                      aria-checked={alarm.enabled}
                      role="switch"
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-on-primary transform transition-transform duration-200 ${
                          alarm.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`} 
                      />
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="p-2 text-error rounded-full hover:bg-error/10"
                      aria-label="Delete alarm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add alarm button */}
      <button
        onClick={() => setShowAddAlarmModal(true)}
        className="absolute bottom-6 right-6 z-10 
                 bg-primary text-on-primary 
                 w-14 h-14 rounded-full shadow-lg 
                 flex items-center justify-center 
                 hover:bg-primary-dark active:scale-95 
                 transition-all duration-150 ease-in-out"
        aria-label="Add Alarm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {/* Add alarm modal */}
      <AddAlarmModal 
        isOpen={showAddAlarmModal} 
        onClose={() => setShowAddAlarmModal(false)} 
        onSave={handleAddAlarm} 
      />
    </div>
  );
};

export default AlarmTab; 