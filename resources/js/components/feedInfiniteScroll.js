import { showToast } from '../utils/helpers.js';

/**
 * feedInfiniteScroll(baseUrl, params)
 *
 * Wires up an IntersectionObserver on #scroll-sentinel.
 * When sentinel enters the viewport, fetches the next page from the server
 * (as an AJAX HTML partial) and appends the rendered cards.
 *
 * The first page is always server-rendered for speed / SEO.
 * This component only loads page 2+.
 */
export const feedInfiniteScroll = (baseUrl, params = {}) => ({
    loading: false,
    hasMore: true,
    nextPage: 2,        // Start at page 2 (page 1 is server-rendered)
    error: null,

    init() {
        this.$nextTick(() => {
            const sentinel = document.getElementById('scroll-sentinel');
            if (!sentinel) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.loading && this.hasMore) {
                        this.loadMore();
                    }
                },
                { rootMargin: '200px' }
            );
            observer.observe(sentinel);
        });
    },

    async loadMore() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.error = null;

        try {
            const url = new URL(baseUrl, window.location.origin);
            url.searchParams.set('page', this.nextPage);

            // Carry through sort / category filters
            Object.entries(params).forEach(([k, v]) => {
                if (v) url.searchParams.set(k, v);
            });

            const response = await fetch(url.toString(), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            // Append rendered HTML to the dynamic container
            if (data.html) {
                const container = document.getElementById('feed-dynamic') ?? this.createDynamicContainer();
                const wrapper = document.createElement('div');
                wrapper.innerHTML = data.html;
                // Initialize Alpine on newly injected elements
                wrapper.querySelectorAll('[x-data]').forEach(el => {
                    if (!el._x_dataStack) {
                        Alpine.initTree(el);
                    }
                });
                container.appendChild(wrapper);
            }

            this.hasMore = data.hasMore;
            this.nextPage = data.nextPage;
        } catch (err) {
            this.error = 'Could not load more quotes.';
            console.error('[feedInfiniteScroll]', err);
        } finally {
            this.loading = false;
        }
    },

    createDynamicContainer() {
        const el = document.createElement('div');
        el.id = 'feed-dynamic';
        el.className = 'flex flex-col gap-4';
        document.getElementById('feed-list')?.appendChild(el);
        return el;
    },
});
