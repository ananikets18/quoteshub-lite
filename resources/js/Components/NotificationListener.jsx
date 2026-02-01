import { useEffect, useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AchievementToast from './AchievementToast';

/**
 * Real-time Notification Listener
 * Listens for WebSocket notifications and plays sounds
 */
export default function NotificationListener({ user }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [achievementToast, setAchievementToast] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!user || !window.Echo) {
            return;
        }

        // Get user's notification preferences
        const preferences = user.notification_preferences;
        setSoundEnabled(preferences?.notification_sounds ?? true);

        // Listen to private channel for this user
        const channel = window.Echo.private(`user.${user.id}`);

        // Listen for notification events
        channel.listen('.notification.sent', (event) => {
            console.log('New notification received:', event);

            // Show achievement toast for achievement unlocks
            if (event.type === 'achievement_unlocked') {
                setAchievementToast({
                    definition: {
                        name: event.data.achievement_name,
                        description: event.data.achievement_description,
                        icon: '🏆',
                        points: 50, // Default points, could be passed from backend
                    },
                });
            }

            // Play notification sound if enabled
            if (soundEnabled && audioRef.current) {
                audioRef.current.play().catch(err => {
                    console.log('Could not play notification sound:', err);
                });
            }

            // Show browser notification if supported and permitted
            if ('Notification' in window && Notification.permission === 'granted') {
                showBrowserNotification(event);
            }

            // Refresh notification count in the UI
            router.reload({ only: ['notifications', 'unreadCount'] });
        });

        // Cleanup on unmount
        return () => {
            channel.stopListening('.notification.sent');
            window.Echo.leave(`user.${user.id}`);
        };
    }, [user, soundEnabled]);

    /**
     * Show browser notification
     */
    const showBrowserNotification = (event) => {
        const { type, data, actor } = event;

        let title = 'QuotesHub';
        let body = '';
        let icon = '/favicon.ico';

        switch (type) {
            case 'new_follower':
                title = 'New Follower';
                body = `${actor?.name || 'Someone'} started following you`;
                icon = actor?.avatar_url || icon;
                break;
            case 'quote_liked':
                title = 'Quote Liked';
                body = `${actor?.name || 'Someone'} liked your quote`;
                icon = actor?.avatar_url || icon;
                break;
            case 'quote_saved':
                title = 'Quote Saved';
                body = `${actor?.name || 'Someone'} saved your quote`;
                icon = actor?.avatar_url || icon;
                break;
            case 'comment_added':
                title = 'New Comment';
                body = `${actor?.name || 'Someone'} commented on your quote`;
                icon = actor?.avatar_url || icon;
                break;
            case 'achievement_unlocked':
                title = '🏆 Achievement Unlocked!';
                body = data.achievement_name;
                break;
            default:
                body = 'You have a new notification';
        }

        const notification = new Notification(title, {
            body,
            icon,
            badge: icon,
            tag: `notification-${event.id}`,
            requireInteraction: false,
        });

        // Navigate to notifications on click
        notification.onclick = () => {
            window.focus();
            router.visit('/notifications');
            notification.close();
        };
    };

    return (
        <>
            {/* Hidden audio element for notification sound */}
            <audio
                ref={audioRef}
                src="/sounds/notification.mp3"
                preload="auto"
                style={{ display: 'none' }}
            />

            {/* Achievement Toast */}
            {achievementToast && (
                <AchievementToast
                    achievement={achievementToast}
                    onClose={() => setAchievementToast(null)}
                />
            )}
        </>
    );
}
