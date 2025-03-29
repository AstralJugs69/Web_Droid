import React, { useState, useEffect, useRef } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';

interface CameraAppProps {
  closeApp: () => void;
}

const CameraApp: React.FC<CameraAppProps> = () => {
  // States for camera permissions and errors
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreamReady, setIsStreamReady] = useState<boolean>(false);
  const { playSound } = useSound();
  
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement>(null);
  // Reference to the media stream
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera permissions and set up the video stream on component mount
  useEffect(() => {
    let mounted = true;
    
    const setupCamera = async () => {
      try {
        console.log("Requesting camera permissions...");
        
        // Request camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // Simplified constraints for better compatibility
          audio: false
        });
        
        // Guard against component unmounting during async operation
        if (!mounted) return;
        
        console.log("Camera permission granted, stream obtained");
        
        // Store the stream reference for cleanup
        streamRef.current = stream;
        
        // Set hasPermission to true immediately when we get the stream
        setHasPermission(true);
        
        // Set video source if ref is available
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Explicitly try to play the video
          try {
            await videoRef.current.play();
            console.log("Video play() called successfully");
          } catch (playError) {
            console.error("Error playing video:", playError);
          }
        } else {
          console.warn("Video ref is not available");
        }
        
        // Fallback: set stream as ready after a timeout
        // This helps if the canplay event doesn't fire
        setTimeout(() => {
          if (mounted && !isStreamReady) {
            console.log("Using fallback timeout to set stream ready");
            setIsStreamReady(true);
          }
        }, 1000);
      } catch (err: any) {
        console.error('Error accessing camera:', err);
        if (mounted) {
          setError(`Camera access denied or not available: ${err.message || err}`);
          setHasPermission(false);
        }
      }
    };

    setupCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [isStreamReady]);

  // Handle video element events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      console.log("Video canplay event fired");
      setIsStreamReady(true);
    };

    const handleLoadedMetadata = () => {
      console.log("Video loadedmetadata event fired");
    };

    const handleError = (e: Event) => {
      console.error('Video element error:', e);
      setError('Error displaying video stream');
      setIsStreamReady(false);
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };
  }, []);

  // Function to manually start the video if needed
  const handleManualStart = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    try {
      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();
      setIsStreamReady(true);
    } catch (err) {
      console.error("Manual start failed:", err);
    }
  };

  // Function to handle taking a photo
  const handleTakePhoto = () => {
    if (!videoRef.current || !hasPermission) return;
    
    if (!isStreamReady) {
      // Try to manually start the video if it's not ready yet
      handleManualStart();
      return;
    }
    
    // Play shutter sound
    playSound('/sounds/shutter.mp3', 0.7);
    
    // In a real app, we would create a canvas element here
    // and capture the current frame from the video
    console.log('Photo captured!');
    
    // Vibrate the device if supported
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  // Render the camera app UI
  return (
    <AppContainer
      appId="camera"
      title="Camera"
      showAppBar={true}
    >
      <div className="relative flex-grow w-full h-full bg-surface">
        {hasPermission === null ? (
          <div className="flex items-center justify-center h-full text-on-surface font-sans">
            Requesting camera permission...
          </div>
        ) : hasPermission === false ? (
          <div className="flex items-center justify-center h-full text-on-surface font-sans">
            {error || "Camera access denied. Please enable camera permissions."}
          </div>
        ) : (
          <>
            {/* Camera viewfinder */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {!isStreamReady && (
              <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4">
                <div className="text-on-surface font-sans">Initializing camera...</div>
                <button 
                  onClick={handleManualStart}
                  className="px-4 py-2 bg-primary text-on-primary rounded-btn font-sans hover:bg-primary-container transition-colors"
                >
                  Tap to start camera
                </button>
              </div>
            )}
            
            {/* Shutter button */}
            <button
              onClick={handleTakePhoto}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-16 h-16 border-4 border-on-surface rounded-full bg-surface-variant/30 backdrop-blur-sm active:bg-surface-variant/50"
              aria-label="Take photo"
            />
          </>
        )}
      </div>
    </AppContainer>
  );
};

export default CameraApp; 