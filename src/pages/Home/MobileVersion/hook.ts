// Настраиваем время долгого нажатия
import { useCallback, useRef } from 'preact/hooks';

const LONG_PRESS_DELAY = 700;

export function useLongPress(callback: () => void, ms = LONG_PRESS_DELAY) {
  const timeoutId = useRef<number | null>(null);

  const startPress = useCallback(() => {
    timeoutId.current = window.setTimeout(() => {
      callback();
    }, ms);
  }, [callback, ms]);

  const endPress = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  return { startPress, endPress };
}
