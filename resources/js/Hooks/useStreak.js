import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook to manage user streak updates
 * 
 * @returns {Object} - { updateStreak, isUpdating, error }
 */
export default function useStreak() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateStreak = useCallback(async () => {
        setIsUpdating(true);
        setError(null);

        try {
            const response = await axios.post('/api/me/streak');
            setIsUpdating(false);
            return {
                success: true,
                data: response.data,
                wasUpdated: response.data.message !== 'Streak already updated today'
            };
        } catch (err) {
            setIsUpdating(false);

            // Don't treat "already updated" or rate limiting as errors
            if (err.response?.status === 429 || err.response?.data?.message?.includes('already updated')) {
                setError(null);
                return {
                    success: true,
                    data: err.response?.data,
                    wasUpdated: false
                };
            }

            const errorMessage = err.response?.data?.error || 'Failed to update streak';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage,
                wasUpdated: false
            };
        }
    }, []);

    return {
        updateStreak,
        isUpdating,
        error
    };
}
