# WebDroid OS

A modern, responsive web-based mobile operating system simulation built with React, TypeScript, and Tailwind CSS.

## Features

- Simulated mobile OS with boot sequence and lock screen
- App switching and navigation system
- Theme toggling (light/dark mode)
- Device type switching (phone/tablet)
- Settings management with localStorage persistence
- Sound effects system with volume control
- 3D inspection mode with Three.js
- Multiple functional apps including:
  - Notes
  - Weather
  - Calculator
  - Browser
  - Camera
  - File Explorer
  - Settings
  - Geo Assault (mini-game)

## Technologies Used

- React with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Three.js for 3D rendering
- React Context API for state management
- Web APIs (localStorage, Geolocation, getUserMedia, etc.)

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

## Project Structure

The project is organized in a modular way:

- `/src` - Main source code
  - `/components` - Reusable UI components
  - `/apps` - Individual app implementations
  - `/hooks` - Custom React hooks
  - `/contexts` - React context providers
  - `/utils` - Utility functions
  - `/models` - TypeScript interfaces and types
  - `/assets` - Static assets like images and icons

## License

MIT 