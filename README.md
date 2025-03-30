# WebDroid OS

A modern, responsive web-based mobile operating system simulation built with React, TypeScript, and Tailwind CSS. WebDroid OS provides a realistic mobile device environment running entirely in the browser.

## Features

- **Device Simulation**
  - Realistic phone and tablet form factors with responsive design
  - Hardware buttons (power, volume) with physical interactions
  - Boot sequence with animated startup screen
  - Lock screen with secure PIN entry
  - Status bar with indicators (battery, clock, network)
  - Navigation bar with home, back, and recents buttons
  - Power menu with restart and shutdown options

- **Core OS Features**
  - Multi-app support with app switching
  - Recent apps view with app previews
  - Settings management with localStorage persistence
  - Theme system with light/dark mode support
  - Multiple visual themes (Default, Emerald Gardens, Cyber Neon, Vintage Paper)
  - Sound effects system with volume control
  - 3D inspection mode powered by Three.js

- **Functional Apps**
  - **Notes**: Create, edit, and organize text notes with internal linking
  - **Weather**: Real-time weather data with location search
  - **Calculator**: Functional calculator with standard operations
  - **Browser**: Simple web browser with bookmarks
  - **Camera**: Access device camera for photos
  - **File Explorer**: Browse and manage virtual file system
  - **Settings**: Comprehensive settings menu for device configuration
  - **Geo Assault**: Mini-game with keyboard controls

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context API for global state
- **3D Rendering**: Three.js for device inspection mode
- **Storage**: localStorage for settings and app data persistence
- **Web APIs**: 
  - Geolocation API for weather location
  - MediaDevices API for camera access
  - Web Audio API for sound synthesis

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **App.tsx**: Root component that initializes the application and context providers
- **DeviceFrame.tsx**: Manages the physical device representation and OS state
- **Contexts**:
  - `SettingsContext`: Global settings state and persistence logic
  - `ThemeContext`: Theme management and application
- **Components**:
  - Core UI components (AppContainer, NavigationBar, StatusBar, etc.)
  - Modal components (PowerMenu, RecentsView)
  - Individual app components in the `/apps` directory
- **Hooks**:
  - `useSound`: Sound playback and management
  - `useLongPress`: Gesture detection for hardware buttons

## Setup and Installation

```bash
# Clone the repository
git clone https://github.com/AstralJugs69/Web_Droid.git

# Navigate to the WebDroid-OS directory
cd Web_Droid/WebDroid-OS

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development Guidelines

### Adding a New App

1. Create a new component in `src/apps/YourAppName.tsx`
2. Use the `AppContainer` component as a wrapper for your app UI
3. Register the app in `src/utils/appManager.tsx`
4. Add an icon for the app in the HomeScreen component

### Themes and Styling

- Use Tailwind utility classes that reference CSS variables (e.g., `bg-primary`, `text-on-surface`)
- Avoid direct color references in component JSX
- Theme variables are defined in `index.css` under `:root`, `.dark`, and theme-specific classes

### State Management

- Use the `useSettings` hook to access global settings
- Implement localStorage persistence for app-specific data
- Follow the pattern in existing apps for state management

## Performance Considerations

- Use `React.memo` for components that don't need frequent re-renders
- Implement virtualization for lists with many items
- Use the `useCallback` and `useMemo` hooks for expensive operations
- Limit the number of concurrently rendered apps with the app manager

## Browser Compatibility

WebDroid OS is designed to work in modern browsers with support for:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Web APIs like localStorage, Geolocation, and MediaDevices

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request with improvements or bug fixes. 