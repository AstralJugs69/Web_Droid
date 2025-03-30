import { useSettings } from '../contexts/SettingsContext';

const ThemeToggleButton = () => {
  const { colorMode, setColorMode } = useSettings();

  const toggleTheme = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-surface-variant dark:bg-surface-variant p-2 rounded-btn text-on-surface dark:text-on-surface transition-colors duration-300"
    >
      Using {colorMode} mode
    </button>
  );
};

export default ThemeToggleButton; 