import { api, handleApiError } from '../services/api.js';
import { showToast, share } from '../utils/helpers.js';

// Quote card Alpine component — handles like, save, share, not-interested
export const quoteCard = (quoteData) => ({
    quote: quoteData,
    liked: quoteData.is_liked || false,
    saved: quoteData.is_saved || false,
    likesCount: quoteData.likes_count || 0,
    savesCount: quoteData.saves_count || 0,
    loading: false,
    dismissed: false,

    async toggleLike() {
        if (this.loading) return;
        if (!window.appData?.authenticated) { window.location.href = '/login'; return; }

        this.loading = true;
        const prev = { liked: this.liked, count: this.likesCount };

        this.liked = !this.liked;
        this.likesCount += this.liked ? 1 : -1;

        try {
            const response = await api.quotes.like(this.quote.id);
            this.liked = response.data.liked ?? response.data.is_liked;
            this.likesCount = response.data.likes_count;
            if (this.liked) showToast('Quote liked! ❤️', 'success');
        } catch (error) {
            this.liked = prev.liked;
            this.likesCount = prev.count;
            showToast(handleApiError(error), 'error');
        } finally {
            this.loading = false;
        }
    },

    async toggleSave() {
        if (this.loading) return;
        if (!window.appData?.authenticated) { window.location.href = '/login'; return; }

        this.loading = true;
        const prev = { saved: this.saved, count: this.savesCount };

        this.saved = !this.saved;
        this.savesCount += this.saved ? 1 : -1;

        try {
            const response = await api.quotes.save(this.quote.id);
            this.saved = response.data.saved ?? response.data.is_saved;
            this.savesCount = response.data.saves_count;
            if (this.saved) showToast('Quote saved! 🔖', 'success');
        } catch (error) {
            this.saved = prev.saved;
            this.savesCount = prev.count;
            showToast(handleApiError(error), 'error');
        } finally {
            this.loading = false;
        }
    },

    async shareQuote() {
        const shareData = {
            title: `Quote by ${this.quote.author}`,
            text: `"${this.quote.content}" — ${this.quote.author}`,
            url: window.location.origin + `/quotes/${this.quote.id}`,
        };
        const shared = await share(shareData);
        if (shared) showToast('Quote shared! 🔗', 'success');
    },

    async markNotInterested(quoteId) {
        try {
            await fetch('/api/feed/not-interested', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ quote_id: quoteId }),
            });
            // Animate card out
            this.dismissed = true;
            setTimeout(() => {
                showToast('Got it! We\'ll show you less like this.', 'success');
            }, 350);
        } catch (e) {
            console.error('[markNotInterested]', e);
        }
    },
});
