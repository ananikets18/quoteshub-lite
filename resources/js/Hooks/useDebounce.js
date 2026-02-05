import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param {Function} callback The function to debounce
 * @param {number} delay The delay in milliseconds
 * @returns {Function} The debounced function
 */
export default function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // Update the callback ref if it changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
}
