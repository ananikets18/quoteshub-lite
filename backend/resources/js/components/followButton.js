import { api, handleApiError } from '../services/api.js';
import { showToast } from '../utils/helpers.js';

// Follow/Unfollow button component
export const followButton = (username, isFollowing = false) => ({
    following: isFollowing,
    loading: false,
    
    async toggle() {
        if (this.loading) return;
        
        this.loading = true;
        const previousState = this.following;
        
        // Optimistic update
        this.following = !this.following;
        
        try {
            if (this.following) {
                await api.users.follow(username);
                showToast('Following user', 'success');
            } else {
                await api.users.unfollow(username);
                showToast('Unfollowed user', 'success');
            }
            
            // Dispatch event for other components to listen
            window.dispatchEvent(new CustomEvent('userFollowChanged', {
                detail: { username, following: this.following }
            }));
        } catch (error) {
            // Rollback on error
            this.following = previousState;
            showToast(handleApiError(error), 'error');
        } finally {
            this.loading = false;
        }
    },
    
    get buttonText() {
        return this.following ? 'Following' : 'Follow';
    },
    
    get buttonClass() {
        return this.following 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            : 'bg-purple-600 text-white hover:bg-purple-700';
    }
});
