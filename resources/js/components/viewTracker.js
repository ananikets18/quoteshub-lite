const trackedQuoteIds = new Set();
let viewObserver = null;

function incrementViewBadge(quoteId) {
    document
        .querySelectorAll(`[data-view-count-for="${quoteId}"]`)
        .forEach((node) => {
            const current = Number.parseInt((node.textContent || '0').trim(), 10);
            node.textContent = Number.isNaN(current) ? '1' : String(current + 1);
        });
}

async function trackQuoteView(quoteId, source = 'feed') {
    try {
        const response = await fetch(`/api/quotes/${quoteId}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ source }),
        });

        if (response.ok) {
            incrementViewBadge(quoteId);
        }
    } catch (error) {
        console.error('[viewTracker] track failed', error);
    }
}

function ensureObserver() {
    if (viewObserver || !('IntersectionObserver' in window)) return;

    viewObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const quoteId = entry.target.getAttribute('data-quote-id');
                const source = entry.target.getAttribute('data-view-source') || 'feed';
                if (!quoteId || trackedQuoteIds.has(quoteId)) return;

                trackedQuoteIds.add(quoteId);
                viewObserver.unobserve(entry.target);
                trackQuoteView(quoteId, source);
            });
        },
        {
            threshold: 0.6,
            rootMargin: '0px 0px -10% 0px',
        }
    );
}

export function initQuoteViewTracker(root = document) {
    ensureObserver();
    if (!viewObserver) return;

    root.querySelectorAll('[data-quote-id]').forEach((card) => {
        if (card.dataset.viewObserved === '1') return;
        card.dataset.viewObserved = '1';
        viewObserver.observe(card);
    });
}
