import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Bookmark, Share2, Eye, Download, Copy, Check } from 'lucide-react';
import { router } from '@inertiajs/react';
import ShareModal from './ShareModal';

// Professional color schemes matching QuoteCard
const colorSchemes = [
    { bg: '#FFFFFF', accent: '#8B5CF6', text: '#1F2937', border: '#E5E7EB' },
    { bg: '#FEFCE8', accent: '#EAB308', text: '#1F2937', border: '#FEF08A' },
    { bg: '#F0FDF4', accent: '#10B981', text: '#1F2937', border: '#BBF7D0' },
    { bg: '#FFF7ED', accent: '#F97316', text: '#1F2937', border: '#FED7AA' },
    { bg: '#FDF2F8', accent: '#EC4899', text: '#1F2937', border: '#FBCFE8' },
    { bg: '#EFF6FF', accent: '#3B82F6', text: '#1F2937', border: '#DBEAFE' },
    { bg: '#F5F3FF', accent: '#A855F7', text: '#1F2937', border: '#E9D5FF' },
    { bg: '#ECFDF5', accent: '#14B8A6', text: '#1F2937', border: '#99F6E4' },
];

export default function QuoteDetailModal({ quote, isOpen, onClose }) {
    const [isLiked, setIsLiked] = useState(quote?.is_liked || false);
    const [isSaved, setIsSaved] = useState(quote?.is_saved || false);
    const [likesCount, setLikesCount] = useState(quote?.likes_count || 0);
    const [savesCount, setSavesCount] = useState(quote?.saves_count || 0);
    const [copied, setCopied] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [viewStartTime, setViewStartTime] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);

    // Sync state when quote prop changes (e.g., after page refresh)
    useEffect(() => {
        if (quote) {
            setIsLiked(quote.is_liked || false);
            setIsSaved(quote.is_saved || false);
            setLikesCount(quote.likes_count || 0);
            setSavesCount(quote.saves_count || 0);
        }
    }, [quote?.id, quote?.is_liked, quote?.is_saved, quote?.likes_count, quote?.saves_count]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Track view start time
            const startTime = Date.now();
            setViewStartTime(startTime);

            // Track view when modal opens
            if (quote?.id) {
                fetch(`/api/quotes/${quote.id}/view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    },
                    body: JSON.stringify({
                        source: 'modal',
                        duration: 0,
                    }),
                }).catch(err => console.log('View tracking failed:', err));
            }
        } else {
            document.body.style.overflow = 'unset';

            // Track duration when modal closes
            if (viewStartTime && quote?.id) {
                const duration = Math.floor((Date.now() - viewStartTime) / 1000);
                if (duration > 0) {
                    fetch(`/api/quotes/${quote.id}/view`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                        },
                        body: JSON.stringify({
                            source: 'modal',
                            duration: duration,
                        }),
                    }).catch(err => console.log('Duration tracking failed:', err));
                }
                setViewStartTime(null);
            }
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, quote?.id]);


    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleLike = (e) => {
        e.stopPropagation();

        // Optimistic update - instant UI feedback
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);

        // Background sync with server
        router.post(`/quotes/${quote.id}/like`, {}, {
            preserveState: true,
            preserveScroll: true,
            only: [],
            onError: () => {
                // Revert on error
                setIsLiked(!newIsLiked);
                setLikesCount(newIsLiked ? likesCount : likesCount + 1);
            },
        });
    };

    const handleSave = (e) => {
        e.stopPropagation();

        // Optimistic update - instant UI feedback
        const newIsSaved = !isSaved;
        setIsSaved(newIsSaved);
        setSavesCount(newIsSaved ? savesCount + 1 : savesCount - 1);

        // Background sync with server
        router.post(`/quotes/${quote.id}/save`, {}, {
            preserveState: true,
            preserveScroll: true,
            only: [],
            onError: () => {
                // Revert on error
                setIsSaved(!newIsSaved);
                setSavesCount(newIsSaved ? savesCount : savesCount + 1);
            },
        });
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const trackShare = () => {
        // Track share when user actually completes a share
        router.post(`/quotes/${quote.id}/share`, {}, {
            preserveState: true,
            preserveScroll: true,
            only: [],
        });
    };

    const handleCopy = async () => {
        const text = `"${quote.content}"\n\n— ${quote.author || 'Unknown'}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        // Create a canvas to render the quote as an image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // Default gradient since we removed it from DB
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add quote text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Word wrap
        const words = quote.content.split(' ');
        let line = '';
        let y = canvas.height / 2 - 100;

        words.forEach((word) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 200) {
                ctx.fillText(line, canvas.width / 2, y);
                line = word + ' ';
                y += 60;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, canvas.width / 2, y);

        // Add author
        ctx.font = '32px sans-serif';
        ctx.fillText(`— ${quote.author || 'Unknown'}`, canvas.width / 2, y + 100);

        // Download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quote-${quote.id}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    if (!isOpen || !quote) return null;

    const colorScheme = colorSchemes[quote.id % colorSchemes.length];

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Full Screen Backdrop */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleBackdropClick}
            />

            {/* Desktop Modal - Center */}
            <div className="hidden md:flex fixed inset-0 items-center justify-center p-4 pointer-events-none">
                <div
                    className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 pointer-events-auto ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Quote Display */}
                    <div
                        className="relative p-12 min-h-[400px] flex flex-col items-center justify-center text-center border-l-4"
                        style={{
                            backgroundColor: colorScheme.bg,
                            borderLeftColor: colorScheme.accent
                        }}
                    >
                        <p
                            className="text-3xl md:text-4xl font-serif leading-relaxed mb-6 font-medium"
                            style={{ color: colorScheme.text }}
                        >
                            "{quote.content}"
                        </p>
                        {quote.author && (
                            <p
                                className="text-xl font-semibold flex items-center justify-center gap-3"
                                style={{ color: colorScheme.accent }}
                            >
                                <span className="w-8 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                                {quote.author}
                                <span className="w-8 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                            </p>
                        )}
                        {quote.source && (
                            <p className="text-sm mt-2 opacity-60" style={{ color: colorScheme.text }}>
                                {quote.source}
                            </p>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-400px)]">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: colorScheme.accent }}
                            >
                                {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {quote.user?.name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{quote.user?.username || 'user'}
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        {quote.categories && quote.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {quote.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{
                                            backgroundColor: category.color + '20',
                                            color: category.color,
                                            borderColor: category.color + '40',
                                            borderWidth: '1px',
                                        }}
                                    >
                                        <span>{category.icon}</span>
                                        <span className="ml-1">{category.name}</span>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                {/* Like */}
                                <button
                                    onClick={handleLike}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Heart
                                        className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {likesCount}
                                    </span>
                                </button>

                                {/* Save */}
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Bookmark
                                        className={`w-5 h-5 ${isSaved ? 'fill-current' : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                        style={{ color: isSaved ? colorScheme.accent : undefined }}
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {savesCount}
                                    </span>
                                </button>

                                {/* Views */}
                                <div className="flex items-center gap-2 px-4 py-2">
                                    <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {quote.views_count || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Copy */}
                                <button
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    title="Copy quote"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>

                                {/* Download */}
                                <button
                                    onClick={handleDownload}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    title="Download as image"
                                >
                                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>

                                {/* Share */}
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    title="Share quote"
                                >
                                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <div className="md:hidden fixed inset-0 flex items-end pointer-events-none">
                <div
                    className={`bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300 pointer-events-auto ${isClosing ? 'translate-y-full' : 'translate-y-0'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>

                    {/* Quote Display */}
                    <div
                        className="relative p-8 min-h-[300px] flex flex-col items-center justify-center text-center border-l-4"
                        style={{
                            backgroundColor: colorScheme.bg,
                            borderLeftColor: colorScheme.accent
                        }}
                    >
                        <p
                            className="text-2xl font-serif leading-relaxed mb-4 font-medium"
                            style={{ color: colorScheme.text }}
                        >
                            "{quote.content}"
                        </p>
                        {quote.author && (
                            <p
                                className="text-lg font-semibold flex items-center justify-center gap-2"
                                style={{ color: colorScheme.accent }}
                            >
                                <span className="w-6 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                                {quote.author}
                                <span className="w-6 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                            </p>
                        )}
                        {quote.source && (
                            <p className="text-sm mt-2 opacity-60" style={{ color: colorScheme.text }}>
                                {quote.source}
                            </p>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="p-4 space-y-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: colorScheme.accent }}
                            >
                                {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {quote.user?.name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{quote.user?.username || 'user'}
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        {quote.categories && quote.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {quote.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{
                                            backgroundColor: category.color + '20',
                                            color: category.color,
                                            borderColor: category.color + '40',
                                            borderWidth: '1px',
                                        }}
                                    >
                                        <span>{category.icon}</span>
                                        <span className="ml-1">{category.name}</span>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-4">
                            <button
                                onClick={handleLike}
                                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Heart
                                    className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                />
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    {likesCount}
                                </span>
                            </button>

                            <button
                                onClick={handleSave}
                                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Bookmark
                                    className={`w-6 h-6 ${isSaved ? 'fill-current' : 'text-gray-600 dark:text-gray-400'}`}
                                    style={{ color: isSaved ? colorScheme.accent : undefined }}
                                />
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    {savesCount}
                                </span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    Share
                                </span>
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium text-green-500">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Copy</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleDownload}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Download</span>
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                show={showShareModal}
                onClose={() => setShowShareModal(false)}
                quote={quote}
                colorScheme={colorScheme}
                onShare={trackShare}
            />
        </div>,
        document.body
    );
}
