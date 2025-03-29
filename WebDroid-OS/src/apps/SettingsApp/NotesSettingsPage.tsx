import React from 'react';
import { useSound } from '../../hooks/useSound';
import { useSettings } from '../../contexts/SettingsContext';

const NotesSettingsPage: React.FC = () => {
  const { 
    notesFontSize, 
    setNotesFontSize, 
    notesSortOrder, 
    setNotesSortOrder 
  } = useSettings();
  const { playSound } = useSound();

  // Handle font size selection
  const handleFontSizeChange = (size: 'sm' | 'base' | 'lg') => {
    playSound('/sounds/click.mp3', 0.2);
    setNotesFontSize(size);
  };

  // Handle sort order selection
  const handleSortOrderChange = (order: 'newest' | 'oldest') => {
    playSound('/sounds/click.mp3', 0.2);
    setNotesSortOrder(order);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Font Size Settings */}
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Appearance
        </h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-on-surface dark:text-dark-on-surface">Font Size</span>
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-dark/10 p-1 dark:bg-dark-surface-light/10">
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  notesFontSize === 'sm'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleFontSizeChange('sm')}
              >
                Small
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  notesFontSize === 'base'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleFontSizeChange('base')}
              >
                Medium
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  notesFontSize === 'lg'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleFontSizeChange('lg')}
              >
                Large
              </button>
            </div>
          </div>
          
          {/* Sample text demonstration */}
          <div className="mt-2 p-3 bg-surface-light dark:bg-dark-surface-light/10 rounded-md border border-surface-dark/20 dark:border-dark-surface-light/10">
            <p className={`text-${notesFontSize} text-on-surface dark:text-dark-on-surface font-normal`}>
              This is a sample text in the selected font size.
            </p>
          </div>
        </div>
      </div>

      {/* Sort Order Settings */}
      <div className="pb-4">
        <h3 className="text-sm font-bold uppercase text-secondary/70 dark:text-dark-secondary/70 mb-4">
          Sorting
        </h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-on-surface dark:text-dark-on-surface">Default Sort Order</span>
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-dark/10 p-1 dark:bg-dark-surface-light/10">
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  notesSortOrder === 'newest'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleSortOrderChange('newest')}
              >
                Newest First
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  notesSortOrder === 'oldest'
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'text-on-surface dark:text-dark-on-surface'
                }`}
                onClick={() => handleSortOrderChange('oldest')}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSettingsPage; 