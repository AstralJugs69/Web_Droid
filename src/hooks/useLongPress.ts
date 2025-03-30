import { useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  onStart?: () => void;
  onCancel?: () => void;
  threshold?: number;
}

export function useLongPress({
  onLongPress,
  onStart,
  onCancel,
  threshold = 600
}: LongPressOptions) {
  const timerRef = useRef<number | null>(null);
  const isLongPressActive = useRef(false);

  const start = useCallback(() => {
    if (onStart) onStart();
    isLongPressActive.current = true;
    
    timerRef.current = window.setTimeout(() => {
      if (isLongPressActive.current) {
        onLongPress();
      }
    }, threshold);
  }, [onLongPress, onStart, threshold]);

  const cancel = useCallback(() => {
    isLongPressActive.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (onCancel) onCancel();
  }, [onCancel]);

  const getHandlers = useCallback(() => ({
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  }), [start, cancel]);

  return getHandlers;
}

export default useLongPress; 