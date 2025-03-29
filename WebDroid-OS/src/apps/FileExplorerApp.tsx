import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppContainer, { AppPreviewState, PreviewStateGetter } from '../components/AppContainer';
import { useSound } from '../hooks/useSound';
import { useSettings } from '../contexts/SettingsContext';

interface FileExplorerAppProps {
  closeApp: () => void;
  registerStateGetter?: (getter: PreviewStateGetter) => void;
}

// File system item interface
interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'text' | 'pdf';
  size?: number;
  lastModified?: string;
  parentId: string | null;
}

// Breadcrumb segment interface for navigation
interface BreadcrumbSegment {
  id: string;
  name: string;
}

// Mock file system data
const mockFileSystem: FileSystemItem[] = [
  { id: 'root', name: 'Root', type: 'folder', parentId: null },
  { id: 'docs', name: 'Documents', type: 'folder', parentId: 'root' },
  { id: 'pics', name: 'Pictures', type: 'folder', parentId: 'root' },
  { id: 'music', name: 'Music', type: 'folder', parentId: 'root' },
  { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'root' },
  
  // Documents files
  { id: 'doc1', name: 'Resume.pdf', type: 'pdf', size: 2048, lastModified: '2023-03-15', parentId: 'docs' },
  { id: 'doc2', name: 'Notes.txt', type: 'text', size: 1024, lastModified: '2023-03-20', parentId: 'docs' },
  { id: 'doc3', name: 'Project.docx', type: 'text', size: 4096, lastModified: '2023-03-25', parentId: 'docs' },
  
  // Pictures files
  { id: 'pic1', name: 'Vacation.jpg', type: 'image', size: 5120, lastModified: '2023-02-10', parentId: 'pics' },
  { id: 'pic2', name: 'Family.png', type: 'image', size: 3072, lastModified: '2023-02-15', parentId: 'pics' },
  { id: 'pic3', name: 'Screenshot.png', type: 'image', size: 1536, lastModified: '2023-02-20', parentId: 'pics' },
  { id: 'pic4', name: 'Profile.jpg', type: 'image', size: 2048, lastModified: '2023-02-25', parentId: 'pics' },
  
  // Music files
  { id: 'music1', name: 'Song1.mp3', type: 'file', size: 10240, lastModified: '2023-01-05', parentId: 'music' },
  { id: 'music2', name: 'Song2.mp3', type: 'file', size: 8192, lastModified: '2023-01-10', parentId: 'music' },
  
  // Downloads files
  { id: 'dl1', name: 'Install.exe', type: 'file', size: 15360, lastModified: '2023-04-01', parentId: 'downloads' },
  { id: 'dl2', name: 'Manual.pdf', type: 'pdf', size: 3072, lastModified: '2023-04-05', parentId: 'downloads' },
];

const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ closeApp, registerStateGetter }) => {
  // State for file explorer
  const [currentPath, setCurrentPath] = useState<string>('root');
  const [currentPathItems, setCurrentPathItems] = useState<FileSystemItem[]>([]);
  const [breadcrumbSegments, setBreadcrumbSegments] = useState<BreadcrumbSegment[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { playSound } = useSound();
  const { deviceType } = useSettings();

  // Determine view mode based on device type
  useEffect(() => {
    setViewMode(deviceType === 'tablet' ? 'grid' : 'list');
  }, [deviceType]);

  // Get preview state for RecentsView
  const getPreviewState = useCallback((): AppPreviewState => {
    return {
      type: 'files',
      currentPath: breadcrumbSegments.map(segment => segment.name).join('/'),
      itemCount: currentPathItems.length
    };
  }, [breadcrumbSegments, currentPathItems.length]);
  
  // Register preview state getter
  useEffect(() => {
    if (registerStateGetter) {
      registerStateGetter(getPreviewState);
    }
  }, [registerStateGetter, getPreviewState]);

  // Update current path items when currentPath changes
  useEffect(() => {
    const items = mockFileSystem.filter(item => item.parentId === currentPath);
    setCurrentPathItems(items);
    
    // Update breadcrumbs
    const segments: BreadcrumbSegment[] = [];
    let currentItem: FileSystemItem | undefined = mockFileSystem.find(item => item.id === currentPath);
    
    while (currentItem) {
      segments.unshift({ id: currentItem.id, name: currentItem.name });
      currentItem = mockFileSystem.find(item => item.id === currentItem?.parentId);
    }
    
    setBreadcrumbSegments(segments);
  }, [currentPath]);

  // Handle item click
  const handleItemClick = useCallback((item: FileSystemItem) => {
    console.log('Item Clicked:', item.id);
    setSelectedItemId(item.id);
    
    if (item.type === 'folder') {
      playSound('/sounds/click.mp3', 0.2);
      setCurrentPath(item.id);
    } else {
      playSound('/sounds/click.mp3', 0.3);
      // For files, just select them (future: open file)
      console.log(`Selected file: ${item.name}`);
    }
  }, [playSound]);

  // Navigate to path from breadcrumb
  const navigateToPathFromBreadcrumb = useCallback((id: string) => {
    playSound('/sounds/click.mp3', 0.2);
    setCurrentPath(id);
  }, [playSound]);

  // Format file size for display
  const formatFileSize = useCallback((size?: number) => {
    if (size === undefined) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  // Get icon for file type
  const getFileIcon = useCallback((item: FileSystemItem, isGridView = false) => {
    const iconSize = isGridView ? 'w-12 h-12' : 'w-6 h-6';
    
    switch (item.type) {
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconSize} text-primary`}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconSize} text-secondary`}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconSize} text-tertiary`}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconSize} text-error`}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15h6" />
            <path d="M9 11h6" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconSize} text-on-surface-variant`}>
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        );
    }
  }, []);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    setSelectedItemId(item.id);
    // Future: Show context menu at e.clientX, e.clientY
    console.log(`Context menu for: ${item.name}`);
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    playSound('/sounds/click.mp3', 0.2);
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  }, [playSound]);

  // Render app bar
  const renderAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={() => {
              playSound('/sounds/click.mp3', 0.3);
              closeApp();
            }}
            className="p-2 rounded-btn mr-2 text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-on-surface font-sans">
            <span className="relative inline-block">
              <span className="invisible">Files</span>
              <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">Files</span>
            </span>
          </h1>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center">
          <button
            onClick={toggleViewMode}
            className="p-2 rounded-btn text-on-surface hover:bg-surface-variant/50 active:scale-95 transition-all duration-200"
            aria-label={viewMode === 'list' ? 'Switch to grid view' : 'Switch to list view'}
          >
            {viewMode === 'list' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Empty state component
  const EmptyFolder = useMemo(() => {
    if (currentPathItems.length > 0) return null;
    
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium text-on-surface-variant font-sans">This folder is empty</p>
        <p className="text-sm text-center max-w-xs text-on-surface-variant/70 font-sans">
          No files or folders found in this location.
        </p>
      </div>
    );
  }, [currentPathItems.length]);

  // Render list view
  const renderListView = () => {
    return (
      <div className="divide-y divide-outline-variant/10">
        {currentPathItems.map(item => (
          <div
            key={item.id}
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
              selectedItemId === item.id
                ? 'bg-primary/20'
                : 'hover:bg-surface-variant/50'
            }`}
            onClick={() => handleItemClick(item)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            <div className="flex-shrink-0 mr-4 bg-transparent">
              {getFileIcon(item)}
            </div>
            <div className="flex-grow min-w-0 bg-transparent">
              <div className="font-medium truncate text-on-surface font-sans">{item.name}</div>
              {item.type !== 'folder' && (
                <div className="text-xs text-on-surface-variant">
                  {formatFileSize(item.size)}
                </div>
              )}
            </div>
            <div className="text-xs text-on-surface-variant ml-auto pl-4 bg-transparent">
              {item.lastModified || (item.type === 'folder' ? 'Folder' : 'File')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
        {currentPathItems.map(item => (
          <div
            key={item.id}
            className={`flex flex-col items-center p-3 rounded-btn cursor-pointer transition-colors duration-150 ${
              selectedItemId === item.id
                ? 'bg-primary/20'
                : 'hover:bg-surface-variant/50'
            }`}
            onClick={() => handleItemClick(item)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            <div className="mb-3 flex-shrink-0 bg-transparent">
              {getFileIcon(item, true)}
            </div>
            <div className="w-full text-center bg-transparent">
              <div className="font-medium truncate max-w-full text-on-surface font-sans">{item.name}</div>
              {item.type !== 'folder' && (
                <div className="text-xs text-on-surface-variant">
                  {formatFileSize(item.size)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppContainer
      appId="files"
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className="h-full flex flex-col bg-page-background text-on-surface">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center px-4 py-2 border-b border-outline-variant/10 overflow-x-auto scrollbar-hide">
          {breadcrumbSegments.map((segment, index) => (
            <React.Fragment key={segment.id}>
              {index > 0 && (
                <span className="text-on-surface-variant/60 mx-1">›</span>
              )}
              <button
                className={`px-2 py-1 rounded-btn text-sm transition-colors font-sans ${
                  index === breadcrumbSegments.length - 1
                    ? 'font-medium text-on-surface'
                    : 'text-primary hover:bg-surface-variant/50'
                }`}
                onClick={() => navigateToPathFromBreadcrumb(segment.id)}
              >
                {index === 0 ? (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                  </div>
                ) : segment.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {/* Main Content - File List or Grid */}
        <div id="app-content-area" className="flex-grow overflow-y-auto h-full bg-page-background">
          {EmptyFolder || (viewMode === 'list' ? renderListView() : renderGridView())}
        </div>
      
        {/* Footer status bar */}
        <div className="p-2 border-t border-outline-variant/10 text-xs text-on-surface-variant font-sans">
          {currentPathItems.length} {currentPathItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>
    </AppContainer>
  );
};

export default FileExplorerApp; 