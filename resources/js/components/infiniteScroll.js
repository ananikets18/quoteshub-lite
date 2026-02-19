import { api, handleApiError } from '../services/api.js';
import { showToast } from '../utils/helpers.js';

// Infinite scroll component for feeds
export const infiniteScroll = (endpoint, params = {}) => ({
    items: [],
    page: 1,
    loading: false,
    hasMore: true,
    error: null,
    
    async init() {
        await this.loadMore();
        
        // Setup intersection observer for infinite scroll
        this.$nextTick(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.loading && this.hasMore) {
                        this.loadMore();
                    }
                },
                { threshold: 0.1 }
            );
            
            const sentinel = document.getElementById('scroll-sentinel');
            if (sentinel) {
                observer.observe(sentinel);
            }
        });
    },
    
    async loadMore() {
        if (this.loading || !this.hasMore) return;
        
        this.loading = true;
        this.error = null;
        
        try {
            const response = await api.quotes.getAll({
                ...params,
                page: this.page,
                per_page: 20
            });
            
            const newItems = response.data.data || [];
            this.items = [...this.items, ...newItems];
            
            // Check if there are more pages
            const meta = response.data.meta;
            this.hasMore = meta && meta.current_page < meta.last_page;
            
            if (this.hasMore) {
                this.page++;
            }
        } catch (error) {
            this.error = handleApiError(error);
            showToast(this.error, 'error');
        } finally {
            this.loading = false;
        }
    },
    
    refresh() {
        this.items = [];
        this.page = 1;
        this.hasMore = true;
        this.loadMore();
    }
});
