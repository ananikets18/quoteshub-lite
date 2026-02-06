import { createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import useStreak from '@/Hooks/useStreak';

// Streak Context - manages global streak state
const StreakContext = createContext();

export function StreakProvider({ children }) {
    const { auth } = usePage().props;
    const { updateStreak } = useStreak();
    const [currentStreak, setCurrentStreak] = useState(auth?.user?.daily_streak || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Auto-update streak on mount (with localStorage caching to prevent excessive API calls)
    useEffect(() => {
        if (!auth?.user) return;

        const performStreakUpdate = async () => {
            // Check if we've already updated today
            const lastUpdateKey = `streak_last_update_${auth.user.id}`;
            const lastUpdate = localStorage.getItem(lastUpdateKey);
            const today = new Date().toDateString();

            if (lastUpdate === today) {
                // Already updated today, skip API call
                return;
            }

            // Set cache BEFORE making the API call to prevent race conditions
            localStorage.setItem(lastUpdateKey, today);

            setIsUpdating(true);
            const result = await updateStreak();
            setIsUpdating(false);

            if (result.success && result.data?.daily_streak !== undefined) {
                setCurrentStreak(result.data.daily_streak);
            }
        };

        performStreakUpdate();
    }, [auth?.user?.id]); // Only run when user changes

    // Sync with auth.user when it changes (e.g., page navigation)
    useEffect(() => {
        if (auth?.user?.daily_streak !== undefined) {
            setCurrentStreak(auth.user.daily_streak);
        }
    }, [auth?.user?.daily_streak]);

    const refreshStreak = async () => {
        if (!auth?.user) return;

        setIsUpdating(true);
        const result = await updateStreak();
        setIsUpdating(false);

        if (result.success && result.data?.daily_streak !== undefined) {
            setCurrentStreak(result.data.daily_streak);
            // Update localStorage cache
            const lastUpdateKey = `streak_last_update_${auth.user.id}`;
            const today = new Date().toDateString();
            localStorage.setItem(lastUpdateKey, today);
            return result;
        }
        return result;
    };

    return (
        <StreakContext.Provider value={{ currentStreak, isUpdating, refreshStreak }}>
            {children}
        </StreakContext.Provider>
    );
}

export function useStreakContext() {
    const context = useContext(StreakContext);
    if (!context) {
        // Fallback for when context is not available
        // This prevents hard errors during development
        const { auth } = usePage().props;
        return {
            currentStreak: auth?.user?.daily_streak || 0,
            isUpdating: false,
            refreshStreak: async () => ({ success: false, wasUpdated: false })
        };
    }
    return context;
}
