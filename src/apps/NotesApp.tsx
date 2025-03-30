import React, { useState, useEffect, useRef } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';
import { useSettings } from '../contexts/SettingsContext';

// Define types locally
type NotesFontSize = 'sm' | 'base' | 'lg';
type ViewMode = 'list' | 'detail';
type DetailMode = 'view' | 'edit';

interface NotesAppProps {
  closeApp: () => void;
}

// Define the Note type
interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

// Utility function for parsing and rendering internal links
const parseAndRenderLinks = (text: string, onLinkClick: (id: string) => void): React.ReactNode[] => {
  if (!text) return []; // Handle empty text

  const linkPattern = /\[\[([^\]]+)\]\]/g;
  const parts: React.ReactNode[] = [];
  
  let lastIndex = 0;
  let match;
  
  // Find all instances of [[linkTarget]] and split the text
  while ((match = linkPattern.exec(text)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Get the link target from the match (without brackets)
    const linkTarget = match[1];
    
    // Add the link element
    parts.push(
      <button 
        key={`link-${match.index}`}
        onClick={() => onLinkClick(linkTarget)}
        className="text-primary underline cursor-pointer"
      >
        [[{linkTarget}]]
      </button>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

const NotesApp: React.FC<NotesAppProps> = ({ }) => {
  // State for notes app
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [detailMode, setDetailMode] = useState<DetailMode>('view');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editText, setEditText] = useState<string>('');
  const { playSound } = useSound();
  const { notesFontSize, notesSortOrder } = useSettings();

  // Add a ref for the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Define font size mapping
  const fontSizeMap: Record<NotesFontSize, string> = {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem'
  };

  // Load notes from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('webdroid-notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      setNotes([]);
    }
  }, []);

  // Update editText when currentNoteId changes
  useEffect(() => {
    if (currentNoteId) {
      const selectedNote = notes.find(note => note.id === currentNoteId);
      if (selectedNote) {
        setEditText(selectedNote.content);
      }
    } else {
      setEditText('');
    }
  }, [currentNoteId, notes]);

  // Helper function to save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    try {
      localStorage.setItem('webdroid-notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  };

  // Handle selecting a note from the list
  const handleNoteSelect = (id: string) => {
    playSound('/sounds/click.mp3', 0.3);
    setCurrentNoteId(id);
    setDetailMode('view'); // Start in view mode
    setViewMode('detail');
  };

  // Handle creating a new note
  const handleNewNote = () => {
    playSound('/sounds/click.mp3', 0.3);
    setCurrentNoteId(null);
    setEditText('');
    setDetailMode('edit'); // Start new notes in edit mode
    setViewMode('detail');
  };

  // Handle saving a note
  const handleSaveNote = () => {
    playSound('/sounds/click.mp3', 0.4);
    if (editText.trim() === '') {
      // Don't save empty notes
      setViewMode('list');
      return;
    }

    const timestamp = Date.now();
    
    if (currentNoteId) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === currentNoteId 
          ? { ...note, content: editText, timestamp } 
          : note
      );
      saveNotes(updatedNotes);
    } else {
      // Create new note
      const newNote: Note = {
        id: `note-${timestamp}`,
        title: '',  // We're using content as title for simplicity
        content: editText,
        timestamp
      };
      saveNotes([...notes, newNote]);
    }
    
    // Return to list view instead of just switching to view mode
    setViewMode('list');
  };

  // Handle deleting a note
  const handleDeleteNote = () => {
    playSound('/sounds/error.mp3', 0.3);
    if (currentNoteId) {
      const updatedNotes = notes.filter(note => note.id !== currentNoteId);
      saveNotes(updatedNotes);
      setViewMode('list');
    }
  };

  // Handle back button click
  const handleBack = () => {
    playSound('/sounds/click.mp3', 0.3);
    if (detailMode === 'edit') {
      // If in edit mode, prompt before discarding changes
      if (window.confirm('Discard unsaved changes?')) {
        if (currentNoteId) {
          setDetailMode('view'); // If editing existing note, go back to view mode
        } else {
          setViewMode('list'); // If creating a new note, go back to list
        }
      }
    } else {
      setViewMode('list'); // If in view mode, go back to list
    }
  };

  // Handle clicking on an internal link
  const handleInternalLinkClick = (id: string) => {
    playSound('/sounds/click.mp3', 0.3);
    alert(`Link clicked: ${id}`);
    // Future enhancement: Find note with matching ID and navigate to it
  };

  // Handle toggling between view and edit modes in detail view
  const handleToggleEditMode = () => {
    playSound('/sounds/click.mp3', 0.3);
    setDetailMode(detailMode === 'view' ? 'edit' : 'view');
  };

  // Find the current note based on currentNoteId
  const currentNote = currentNoteId 
    ? notes.find(note => note.id === currentNoteId) 
    : null;

  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Sort notes based on settings
  const getSortedNotes = () => {
    return [...notes].sort((a, b) => {
      if (notesSortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });
  };

  // Create app bar content for list view
  const renderListAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium text-on-surface font-sans">
          <span className="relative inline-block">
            <span className="invisible">Notes</span>
            <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">Notes</span>
          </span>
        </h1>
      </div>
    );
  };

  // Create app bar content for detail view
  const renderDetailAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="p-2 rounded-btn mr-2 text-on-surface hover:bg-surface/20 active:scale-95 transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-on-surface font-sans">
            <span className="relative inline-block">
              <span className="invisible">{currentNote ? 'Edit Note' : 'New Note'}</span>
              <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">{currentNote ? 'Edit Note' : 'New Note'}</span>
            </span>
          </h1>
        </div>
        
        <div className="flex items-center">
          {detailMode === 'view' && currentNoteId && (
            <button 
              className="p-2 rounded-btn text-on-surface hover:bg-surface/20 active:scale-95 transition-all duration-200"
              onClick={handleToggleEditMode}
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          )}
          
          {detailMode === 'edit' && (
            <button 
              className="p-2 rounded-btn text-primary hover:bg-surface/20 active:scale-95 transition-all duration-200"
              onClick={handleSaveNote}
              aria-label="Save"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </button>
          )}
          
          {currentNoteId && (
            <button 
              className="ml-2 p-2 rounded-btn text-error hover:bg-error/10 active:scale-95 transition-all duration-200"
              onClick={handleDeleteNote}
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render the list view with notes sorted according to settings
  const renderListView = () => {
    const sortedNotes = getSortedNotes();
    
    return (
      <div className="flex flex-col h-full relative">
        {/* Notes list */}
        <div className="flex-1 overflow-y-auto pb-24">
          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-on-surface-variant">No notes yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {sortedNotes.map(note => (
                <div
                  key={note.id}
                  className="px-4 py-3 hover:bg-surface/50 active:bg-surface-variant/30 cursor-pointer transition-colors"
                  onClick={() => handleNoteSelect(note.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-on-surface mb-1 line-clamp-1 font-sans">{note.title}</h3>
                    <span className="text-xs text-on-surface-variant ml-2 whitespace-nowrap">{formatDate(note.timestamp)}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2 font-sans">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) */}
        <button
          onClick={handleNewNote}
          className="absolute bottom-6 right-6 z-10 
                   bg-primary text-on-primary 
                   w-14 h-14 rounded-full shadow-lg 
                   flex items-center justify-center 
                   hover:bg-primary-dark active:scale-95 
                   transition-all duration-150 ease-in-out"
          aria-label="New Note"
        >
          {/* Plus Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  };

  // Render the detail view with the selected note
  const renderDetailView = () => {
    if (detailMode === 'edit') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            <textarea
              ref={textareaRef}
              className="w-full h-full min-h-[300px] bg-transparent border-none resize-none outline-none text-on-surface placeholder-on-surface-variant/50 font-sans p-0"
              placeholder="Start typing here... You can link to other notes using [[note title]] syntax."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ fontSize: fontSizeMap[notesFontSize] }}
            />
          </div>

          {/* Only show bottom buttons when editing an existing note */}
          {currentNoteId && (
            <div className="p-4 flex justify-between border-t border-outline-variant/10 bg-surface">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-btn hover:bg-surface-variant/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-primary text-on-primary rounded-btn hover:bg-primary-container transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      );
    }
    
    const selectedNote = currentNoteId 
      ? notes.find(note => note.id === currentNoteId) 
      : null;
    
    if (!selectedNote) return null;
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="mb-2 text-sm text-secondary/70">
            {formatDate(selectedNote.timestamp)}
          </div>
          
          <div className={`whitespace-pre-wrap text-${notesFontSize} text-on-surface font-sans`}>
            {parseAndRenderLinks(selectedNote.content, handleInternalLinkClick)}
          </div>
        </div>
        
        <div className="p-4 flex justify-between border-t border-outline-variant/10 bg-surface">
          <button
            onClick={handleDeleteNote}
            className="px-4 py-2 text-error bg-surface-variant/50 rounded-btn hover:bg-error/10 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleToggleEditMode}
            className="px-4 py-2 bg-primary text-on-primary rounded-btn hover:bg-primary-container transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  return (
    <AppContainer
      appId="notes"
      showAppBar={true}
      appBarContent={viewMode === 'list' ? renderListAppBar() : renderDetailAppBar()}
    >
      <div className="w-full h-full bg-page-background flex flex-col">
        {viewMode === 'list' ? (
          <div className="flex-1 overflow-hidden transition-opacity duration-300">
            {renderListView()}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden transition-opacity duration-300">
            {renderDetailView()}
          </div>
        )}
      </div>
    </AppContainer>
  );
};

export default NotesApp; 