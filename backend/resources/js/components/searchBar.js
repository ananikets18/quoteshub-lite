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

    escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    },
    
    highlightMatch(text, query) {
        if (!text) return '';
        const escapedText = this.escapeHTML(text);
        if (!query) return escapedText;
        
        // Escape query to safely put in Regex and match against escapedText
        // Also escape regex special chars in the query just in case
        const escapedQuery = this.escapeHTML(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        
        return escapedText.replace(regex, '<mark style="background:var(--brand-muted);color:inherit;border-radius:2px;padding:0 2px;">$1</mark>');
    }
});
