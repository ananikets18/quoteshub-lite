import { api, handleApiError } from '../services/api.js';
import { showToast } from '../utils/helpers.js';

// Notification system with real-time polling
export const notificationSystem = () => ({
    notifications: [],
    unreadCount: 0,
    isOpen: false,
    loading: false,
    pollInterval: null,
    
    async init() {
        await this.fetchNotifications();
        this.startPolling();
        
        // Listen for manual refresh
        window.addEventListener('refreshNotifications', () => this.fetchNotifications());
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.stopPolling());
    },
    
    async fetchNotifications() {
        try {
            const [notifsResponse, countResponse] = await Promise.all([
                api.notifications.getAll({ per_page: 10, unread_only: 0 }),
                api.notifications.getUnreadCount()
            ]);
            
            this.notifications = notifsResponse.data.data || [];
            this.unreadCount = countResponse.data.unread_count || 0;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    },
    
    startPolling() {
        // Poll every 30 seconds
        this.pollInterval = setInterval(() => {
            this.fetchNotifications();
        }, 30000);
    },
    
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },
    
    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen && this.unreadCount > 0) {
            // Mark all as read when opening
            setTimeout(() => this.markAllAsRead(), 1000);
        }
    },
    
    close() {
        this.isOpen = false;
    },
    
    async markAllAsRead() {
        if (this.unreadCount === 0) return;
        
        try {
            await api.notifications.markAllRead();
            this.notifications.forEach(n => n.read_at = new Date().toISOString());
            this.unreadCount = 0;
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    },
    
    async deleteNotification(id) {
        try {
            await api.notifications.delete(id);
            this.notifications = this.notifications.filter(n => n.id !== id);
            await this.fetchNotifications(); // Refresh count
            showToast('Notification deleted', 'success');
        } catch (error) {
            showToast(handleApiError(error), 'error');
        }
    },
    
    async deleteAllRead() {
        try {
            await api.notifications.deleteAllRead();
            await this.fetchNotifications();
            showToast('Read notifications deleted', 'success');
        } catch (error) {
            showToast(handleApiError(error), 'error');
        }
    },
    
    goToNotification(notification) {
        // Navigate based on notification type
        const urls = {
            'like': `/quotes/${notification.data.quote_id}`,
            'save': `/quotes/${notification.data.quote_id}`,
            'follow': `/profile/${notification.actor?.username}`,
            'comment': `/quotes/${notification.data.quote_id}`,
            'achievement': '/achievements',
        };
        
        const url = urls[notification.type] || '/notifications';
        window.location.href = url;
    },
    
    destroy() {
        this.stopPolling();
    }
});
