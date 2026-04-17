import { useEffect, useRef, RefObject } from 'react';

export function useFocusTrap(isActive: boolean): RefObject<HTMLElement | null> {
  const trapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const focusableElementsSelector = 
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (!trapRef.current) return;
      
      const focusableElements = trapRef.current.querySelectorAll(focusableElementsSelector);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus
    if (trapRef.current) {
        const focusableElements = trapRef.current.querySelectorAll(focusableElementsSelector);
        if (focusableElements.length > 0) {
            // setTimeout to wait for render
            setTimeout(() => focusableElements[0].focus(), 100);
        }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return trapRef;
}
