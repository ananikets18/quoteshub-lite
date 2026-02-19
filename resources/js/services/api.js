import axios from 'axios';

// API service layer - abstraction for all HTTP calls
export const api = {
    // Quotes
    quotes: {
        getAll: (params = {}) => axios.get('/api/quotes', { params }),
        getOne: (id) => axios.get(`/api/quotes/${id}`),
        like: (id) => axios.post(`/api/quotes/${id}/like`),
        save: (id) => axios.post(`/api/quotes/${id}/save`),
        create: (data) => axios.post('/api/quotes', data),
        update: (id, data) => axios.put(`/api/quotes/${id}`, data),
        delete: (id) => axios.delete(`/api/quotes/${id}`),
    },
    
    // Notifications
    notifications: {
        getAll: (params = {}) => axios.get('/api/notifications', { params }),
        getUnreadCount: () => axios.get('/api/notifications/unread-count'),
        markRead: (id) => axios.post(`/api/notifications/${id}/read`),
        markAllRead: () => axios.post('/api/notifications/mark-all-read'),
        delete: (id) => axios.delete(`/api/notifications/${id}`),
        deleteAllRead: () => axios.delete('/api/notifications/read/all'),
    },
    
    // Users
    users: {
        follow: (username) => axios.post(`/users/${username}/follow`),
        unfollow: (username) => axios.delete(`/users/${username}/follow`),
        getProfile: (username) => axios.get(`/api/users/${username}`),
    },
    
    // Activity
    activity: {
        getFeed: (params = {}) => axios.get('/api/activity/feed', { params }),
        getTrending: (params = {}) => axios.get('/api/activity/trending', { params }),
        getSuggestedUsers: (params = {}) => axios.get('/api/activity/suggested-users', { params }),
    },
    
    // Categories
    categories: {
        getAll: () => axios.get('/api/categories'),
        getOne: (slug) => axios.get(`/api/categories/${slug}`),
    },
};

// Error handler helper
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        // Request made but no response
        return 'Network error. Please check your connection.';
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
};
