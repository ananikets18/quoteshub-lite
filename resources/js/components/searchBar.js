import { debounce } from '../utils/helpers.js';
import axios from 'axios';

// Search bar with live results
export const searchBar = () => ({
    query: '',
    results: [],
    loading: false,
    isOpen: false,
    
    init() {
        // Debounced search function
        this.debouncedSearch = debounce(() => this.search(), 300);
        
        // Keyboard shortcut: Cmd/Ctrl + K
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.$refs.searchInput?.focus();
                this.isOpen = true;
            }
            
            // Escape to close
            if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.close();
            }
        });
    },
    
    onInput() {
        if (this.query.length < 2) {
            this.results = [];
            this.isOpen = false;
            return;
        }
        
        this.isOpen = true;
        this.loading = true;
        this.debouncedSearch();
    },
    
    async search() {
        if (!this.query) {
            this.results = [];
            return;
        }
        
        try {
            const response = await axios.get('/api/search', {
                params: { q: this.query, limit: 5 }
            });
            
            this.results = response.data;
            this.loading = false;
        } catch (error) {
            console.error('Search failed:', error);
            this.loading = false;
        }
    },
    
    selectResult(result) {
        // Navigate to result
        if (result.type === 'quote') {
            window.location.href = `/quotes/${result.id}`;
        } else if (result.type === 'user') {
            window.location.href = `/profile/${result.username}`;
        } else if (result.type === 'category') {
            window.location.href = `/categories/${result.slug}`;
        }
    },
    
    close() {
        this.isOpen = false;
        this.query = '';
        this.results = [];
    },
    
    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    }
});
