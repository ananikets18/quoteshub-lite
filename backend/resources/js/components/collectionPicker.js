import { showToast } from '../utils/helpers.js';

/**
 * collectionPicker(quoteId)
 *
 * Dropdown picker on each quote card that lets users add/remove
 * the quote from any of their collections via AJAX.
 */
export const collectionPicker = (quoteId) => ({
    open: false,
    collections: [],
    activeIds: [],       // collection IDs this quote is currently in
    loadingCollections: false,
    quoteId,

    get inAny() {
        return this.activeIds.length > 0;
    },

    isInCollection(colId) {
        return this.activeIds.includes(colId);
    },

    async toggle() {
        this.open = !this.open;

        // Lazy-load collections on first open
        if (this.open && this.collections.length === 0) {
            await this.fetchCollections();
        }
    },

    async fetchCollections() {
        this.loadingCollections = true;
        try {
            const res = await fetch('/api/collections', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            const data = await res.json();
            this.collections = data.collections ?? [];
        } catch (e) {
            console.error('[collectionPicker] fetch error', e);
        } finally {
            this.loadingCollections = false;
        }
    },

    async toggleCollection(col) {
        const alreadyIn = this.isInCollection(col.id);
        const method = alreadyIn ? 'DELETE' : 'POST';
        const url = `/api/collections/${col.id}/quotes/${this.quoteId}`;

        // Optimistic UI
        if (alreadyIn) {
            this.activeIds = this.activeIds.filter(id => id !== col.id);
        } else {
            this.activeIds = [...this.activeIds, col.id];
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                credentials: 'same-origin',
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            showToast(data.message, 'success');
        } catch (err) {
            // Rollback on error
            if (alreadyIn) {
                this.activeIds = [...this.activeIds, col.id];
            } else {
                this.activeIds = this.activeIds.filter(id => id !== col.id);
            }
            showToast('Could not update collection.', 'error');
        }
    },
});
