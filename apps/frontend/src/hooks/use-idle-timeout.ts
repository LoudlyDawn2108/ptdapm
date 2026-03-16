import { useCallback, useEffect, useRef } from "react";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Auto-logout after 30 minutes of inactivity.
 * Resets timer on mouse, keyboard, scroll, and touch events.
 */
export function useIdleTimeout(onTimeout: () => void) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => onTimeoutRef.current(), IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    for (const e of events) {
      window.addEventListener(e, resetTimer);
    }
    resetTimer(); // Start initial timer

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      for (const e of events) {
        window.removeEventListener(e, resetTimer);
      }
    };
  }, [resetTimer]);
}
