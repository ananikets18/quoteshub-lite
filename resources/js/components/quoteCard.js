import { api, handleApiError } from '../services/api.js';
import { showToast, share } from '../utils/helpers.js';

// Quote card component with like/save functionality
export const quoteCard = (quoteData) => ({
    quote: quoteData,
    liked: quoteData.is_liked || false,
    saved: quoteData.is_saved || false,
    likesCount: quoteData.likes_count || 0,
    savesCount: quoteData.saves_count || 0,
    loading: false,
    
    async toggleLike() {
        if (this.loading) return;
        
        // Check authentication
        if (!window.appData?.authenticated) {
            window.location.href = '/login';
            return;
        }
        
        this.loading = true;
        const previousState = this.liked;
        const previousCount = this.likesCount;
        
        // Optimistic update
        this.liked = !this.liked;
        this.likesCount += this.liked ? 1 : -1;
        
        try {
            const response = await api.quotes.like(this.quote.id);
            // Update with server response
            this.liked = response.data.liked;
            this.likesCount = response.data.likes_count;
            
            // Show feedback
            if (this.liked) {
                showToast('Quote liked!', 'success');
            }
        } catch (error) {
            // Rollback on error
            this.liked = previousState;
            this.likesCount = previousCount;
            showToast(handleApiError(error), 'error');
        } finally {
            this.loading = false;
        }
    },
    
    async toggleSave() {
        if (this.loading) return;
        
        // Check authentication
        if (!window.appData?.authenticated) {
            window.location.href = '/login';
            return;
        }
        
        this.loading = true;
        const previousState = this.saved;
        const previousCount = this.savesCount;
        
        // Optimistic update
        this.saved = !this.saved;
        this.savesCount += this.saved ? 1 : -1;
        
        try {
            const response = await api.quotes.save(this.quote.id);
            this.saved = response.data.saved;
            this.savesCount = response.data.saves_count;
            
            if (this.saved) {
                showToast('Quote saved!', 'success');
            }
        } catch (error) {
            // Rollback on error
            this.saved = previousState;
            this.savesCount = previousCount;
            showToast(handleApiError(error), 'error');
        } finally {
            this.loading = false;
        }
    },
    
    async shareQuote() {
        const shareData = {
            title: `Quote by ${this.quote.author}`,
            text: `"${this.quote.content}" — ${this.quote.author}`,
            url: window.location.origin + `/quotes/${this.quote.id}`
        };
        
        const shared = await share(shareData);
        if (shared) {
            showToast('Quote shared!', 'success');
        }
    },
});
