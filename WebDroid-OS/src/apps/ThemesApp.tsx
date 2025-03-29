import React from 'react';
import AppContainer from '../components/AppContainer';
import { availableThemes, useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';

interface ThemesAppProps {
  closeApp: () => void;
}

const ThemesApp: React.FC<ThemesAppProps> = ({ closeApp }) => {
  const { 
    activeThemeId, 
    setActiveThemeId, 
    colorMode, 
    setColorMode,
    activePageBgId,
    setActivePageBgId
  } = useSettings();
  const { playSound } = useSound();

  const pageBgOptions = [
    { id: 'default', name: 'Default Blue' },
    { id: 'gradientA', name: 'Sunset' },
    { id: 'gradientB', name: 'Ocean' },
    { id: 'gradientC', name: 'Forest' },
  ];

  const handleThemeSelect = (themeId: string) => {
    playSound('click', 0.2);
    setActiveThemeId(themeId);
  };

  const handlePageBgSelect = (bgId: string) => {
    playSound('click', 0.2);
    setActivePageBgId(bgId);
  };

  const toggleColorMode = () => {
    playSound('click', 0.2);
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContainer
      appId="themes"
      title="Themes"
      showAppBar={true}
      onBackClick={closeApp}
    >
      <div className="h-full overflow-y-auto bg-page-background">
        <div className="p-4 space-y-6 pb-28">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-primary font-sans">
              Select Theme
            </h2>
            <p className="text-sm text-on-surface-variant mb-4 font-sans">
              Choose a theme to personalize your WebDroid OS experience.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeThemeId === theme.id
                      ? 'border-primary'
                      : 'border-transparent hover:border-outline-variant'
                  }`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  {/* Theme color preview */}
                  <div className="h-20 flex">
                    {theme.colors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1" 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Theme preview with custom components */}
                  <div className={`py-3 px-4 ${theme.forcedMode === 'dark' || colorMode === 'dark' ? 'dark' : ''}`}>
                    <div className={`theme-${theme.id} p-3 rounded-lg bg-surface`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary">
                          <span className="text-sm">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 w-16 bg-secondary/30 rounded-full"></div>
                          <div className="h-1.5 w-12 bg-secondary/20 rounded-full mt-1"></div>
                        </div>
                        <div className="w-6 h-6 rounded-md bg-tertiary/80"></div>
                      </div>
                    </div>
                  </div>

                  {/* Theme name */}
                  <div className="p-2 text-center text-sm font-medium text-on-surface font-sans">
                    {theme.name}
                    {activeThemeId === theme.id && (
                      <span className="ml-1 text-primary">✓</span>
                    )}
                  </div>
                  {theme.forcedMode && (
                    <div className="pb-2 text-center text-xs text-on-surface-variant font-sans">
                      {theme.forcedMode === 'dark' ? 'Always dark' : 'Always light'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Page Background Selection (renamed from Wallpaper) */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-primary font-sans">
              Page Background
            </h2>
            <p className="text-sm text-on-surface-variant mb-4 font-sans">
              Choose a background gradient style for your device screen.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pageBgOptions.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => handlePageBgSelect(bg.id)}
                  className={`
                    w-full aspect-[9/16] rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-all duration-200
                    ${activePageBgId === bg.id 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-outline-variant hover:border-primary/50'}
                  `}
                >
                  <div 
                    className="w-full h-full"
                    style={{ backgroundImage: `var(--wallpaper-gradient-${bg.id})` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-surface-variant/70 py-1 px-2">
                    <span className="text-xs text-on-surface-variant font-medium truncate block text-center font-sans">
                      {bg.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Only show color mode toggle if current theme doesn't force a mode */}
          {!availableThemes.find(theme => theme.id === activeThemeId)?.forcedMode && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-primary font-sans">
                Color Mode
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  className={`px-4 py-2 rounded-lg flex-1 transition-all border-2 ${
                    colorMode === 'light'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-transparent bg-surface-variant text-on-surface-variant'
                  }`}
                  onClick={toggleColorMode}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span>Light</span>
                  </div>
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex-1 transition-all border-2 ${
                    colorMode === 'dark'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-transparent bg-surface-variant text-on-surface-variant'
                  }`}
                  onClick={toggleColorMode}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span>Dark</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-primary font-sans">
              About Themes
            </h2>
            <p className="text-sm text-on-surface-variant font-sans">
              Themes and page backgrounds change the visual appearance of WebDroid OS. Some themes may override your color mode preference with their own light or dark setting.
            </p>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default ThemesApp; 