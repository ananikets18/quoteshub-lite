import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Heart, Bookmark, Share2, Eye, MoreVertical, Edit2, Trash2, Flag, EyeOff, CheckCircle, Folder } from 'lucide-react';
import QuoteDetailModal from './QuoteDetailModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ReportModal from './ReportModal';
import AddToCollectionModal from './AddToCollectionModal';
import ShareModal from './ShareModal';
import Toast from './Toast';
import AuthPromptModal from './AuthPromptModal';
import axios from 'axios';
import useDebounce from '@/Hooks/useDebounce';

// Professional color schemes matching QuoteDetailModal
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

export default function QuoteCard({ quote, compact = false, auth, collections = [], onUnsave = null, showSavedContext = false }) {
    const [isLiked, setIsLiked] = useState(quote.is_liked || false);
    const [isSaved, setIsSaved] = useState(quote.is_saved || false);
    const [expectedLiked, setExpectedLiked] = useState(quote.is_liked || false);
    const [expectedSaved, setExpectedSaved] = useState(quote.is_saved || false);

    const [likesCount, setLikesCount] = useState(quote.likes_count || 0);
    const [savesCount, setSavesCount] = useState(quote.saves_count || 0);
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Toast notifications
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    // Auth prompt modal
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authAction, setAuthAction] = useState('like');

    const isOwner = auth?.user?.id === quote.user_id;

    // Sync state when quote prop changes (e.g., after page refresh)
    useEffect(() => {
        setIsLiked(quote.is_liked || false);
        setExpectedLiked(quote.is_liked || false);

        setIsSaved(quote.is_saved || false);
        setExpectedSaved(quote.is_saved || false);

        setLikesCount(quote.likes_count || 0);
        setSavesCount(quote.saves_count || 0);
    }, [quote.id, quote.is_liked, quote.is_saved, quote.likes_count, quote.saves_count]);

    // Don't render if deleted or hidden (not interested)
    if (isDeleted || isHidden) {
        return null;
    }

    const showNotification = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    // Format timestamp to relative time
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;

        const now = new Date();
        const postDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;

        // For older posts, show actual date
        return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Check if quote is long (over 280 characters)
    const isLongQuote = quote.content && quote.content.length > 280;
    const displayContent = (!isExpanded && isLongQuote)
        ? quote.content.substring(0, 280) + '...'
        : quote.content;

    // Debounced sync for Likes
    const syncLike = useDebounce(() => {
        if (isLiked !== expectedLiked) {
            setExpectedLiked(isLiked);
            router.post(`/quotes/${quote.id}/like`, {}, {
                preserveState: true,
                preserveScroll: true,
                only: [],
                onError: () => {
                    // Revert on error
                    const previousState = !isLiked;
                    setIsLiked(previousState);
                    setExpectedLiked(previousState);
                    setLikesCount(previousState ? likesCount + 1 : likesCount - 1);
                    showNotification('Failed to update like. Please try again.', 'error');
                },
            });
        }
    }, 500);

    const handleLike = (e) => {
        e.stopPropagation();

        if (!auth?.user) {
            setAuthAction('like');
            setShowAuthModal(true);
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);

        // Trigger debounced sync
        syncLike();
    };

    // Debounced sync for Saves
    const syncSave = useDebounce(() => {
        if (isSaved !== expectedSaved) {
            setExpectedSaved(isSaved);
            router.post(`/quotes/${quote.id}/save`, {}, {
                preserveState: true,
                preserveScroll: true,
                only: [],
                onError: () => {
                    // Revert on error
                    const previousState = !isSaved;
                    setIsSaved(previousState);
                    setExpectedSaved(previousState);
                    setSavesCount(previousState ? savesCount + 1 : savesCount - 1);

                    // Stop fading if it was an unsave that failed
                    setIsFadingOut(false);

                    showNotification('Failed to save quote. Please try again.', 'error');
                },
            });
        }
    }, 500);

    const handleSave = (e) => {
        e.stopPropagation();

        if (!auth?.user) {
            setAuthAction('save');
            setShowAuthModal(true);
            return;
        }

        // Optimistic update
        const newIsSaved = !isSaved;
        const wasUnsaved = isSaved && !newIsSaved;

        setIsSaved(newIsSaved);
        setSavesCount(newIsSaved ? savesCount + 1 : savesCount - 1);

        // If unsaving and callback provided, trigger fade out immediately
        // Note: We might revert this if the server request fails, but for UX responsiveness this is better
        if (wasUnsaved && onUnsave) {
            setIsFadingOut(true);
            setTimeout(() => {
                // If we haven't reverted due to error (checked via ref ideally, but simplistic here)
                if (onUnsave && isFadingOut) onUnsave(quote.id);
            }, 300);
        }

        // Trigger debounced sync
        syncSave();
    };

    const handleShare = async (e) => {
        e.stopPropagation();

        // Check authentication
        if (!auth?.user) {
            setAuthAction('share');
            setShowAuthModal(true);
            return;
        }

        // Open share modal for comprehensive sharing options
        setShowShareModal(true);
    };

    const trackShare = () => {
        // Track share count when user actually completes a share
        router.post(`/quotes/${quote.id}/share`, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [],
        });
    };

    const handleCardClick = () => {
        // Don't open quote detail if any other modal is open
        if (showMenu || showDeleteModal || showReportModal || showCollectionModal || showShareModal || showAuthModal) {
            return;
        }
        setShowModal(true);
    };

    const handleUserClick = (e) => {
        e.stopPropagation(); // Prevent opening quote modal
        if (quote.user?.username) {
            router.visit(`/${quote.user.username}`);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        router.visit(`/quotes/${quote.id}/edit`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/quotes/${quote.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleted(true);
                setShowDeleteModal(false);
                showNotification('Quote deleted successfully', 'success');
            },
            onError: () => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                showNotification('Failed to delete quote. Please try again.', 'error');
            },
        });
    };

    const handleReport = (data) => {
        router.post(`/quotes/${quote.id}/report`, data, {
            preserveScroll: true,
            onSuccess: () => {
                showNotification('Report submitted successfully. We\'ll review it soon.', 'success');
                setShowReportModal(false);
            },
            onError: () => {
                showNotification('Failed to submit report. Please try again.', 'error');
            },
        });
    };

    const handleNotInterested = async (e) => {
        e.stopPropagation();
        setShowMenu(false);

        try {
            // Get CSRF token
            const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;

            const response = await axios.post('/api/preferences/not-interested', {
                item_type: 'quote',
                item_id: quote.id,
                reason: 'dont_like',
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                // Show success message
                showNotification('Quote hidden. We\'ll show you less like this.', 'success');

                // Start fade out animation
                setIsFadingOut(true);

                // Remove from DOM after animation
                setTimeout(() => {
                    setIsHidden(true);
                }, 500);
            }
        } catch (error) {
            console.error('Failed to mark as not interested:', error);
            showNotification('Failed to update preference. Please try again.', 'error');
        }
    };

    return (
        <div
            className={`cursor-pointer transition-all duration-300 ${isFadingOut ? 'opacity-0 scale-95' : 'opacity-100'
                }`}
            onClick={handleCardClick}
        >
            {/* Open Card Design - Free and Spaced */}
            <div className="bg-white dark:bg-gray-800 px-4 sm:px-5 py-4 sm:py-5 hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700">

                {/* Header: User Info */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Avatar - Clickable */}
                        <button
                            onClick={handleUserClick}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#5D41E6] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:ring-4 hover:ring-[#5D41E6]/20 transition-all duration-200 transform hover:scale-105"
                            aria-label={`Visit ${quote.user?.name || 'user'}'s profile`}
                        >
                            {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </button>

                        {/* User Details - Clickable */}
                        <button
                            onClick={handleUserClick}
                            className="flex flex-col text-left group"
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-tight group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors duration-200">
                                    {quote.user?.name || 'Anonymous'}
                                </span>
                                {quote.created_at && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {formatTimestamp(quote.created_at)}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors duration-200">
                                @{quote.user?.username || 'user'}
                            </span>
                        </button>
                    </div>

                    {/* Menu Button */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div
                                className="absolute right-0 top-full mt-1 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isOwner ? (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left flex items-center gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-medium">Edit</span>
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left flex items-center gap-2 sm:gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-medium">Delete</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {auth?.user && (
                                            <button
                                                onClick={handleNotInterested}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left flex items-center gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition-colors"
                                            >
                                                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm font-medium">Not Interested</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                setShowReportModal(true);
                                            }}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left flex items-center gap-2 sm:gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                        >
                                            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-medium">Report</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quote Content */}
                <div className="mt-3">
                    {/* Quote Text - Open and Breathable */}
                    <div className="mb-3">
                        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-900 dark:text-white whitespace-pre-line">
                            {displayContent}
                        </p>

                        {/* Read More/Less Button for Long Quotes */}
                        {isLongQuote && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="mt-2 text-sm font-bold text-[#5D41E6] dark:text-purple-400 hover:text-[#4a31c9] dark:hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Author & Source - Minimal Design */}
                    {(quote.author || quote.source) && (
                        <div className="mb-3 pl-3 sm:pl-4 border-l-[3px] border-[#5D41E6] dark:border-purple-500">
                            {quote.author && (
                                <p className="text-sm sm:text-base font-semibold text-[#5D41E6] dark:text-purple-400 leading-tight">
                                    — {quote.author}
                                </p>
                            )}
                            {quote.source && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    {quote.source}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Categories - Clean Pills */}
                    {quote.categories && quote.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {quote.categories.slice(0, 3).map((category) => (
                                <span
                                    key={category.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-[#5D41E6] dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className="text-sm">{category.icon}</span>
                                    <span>{category.name}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Bar - Clean and Open */}
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
                    {/* Left Actions */}
                    <div className="flex items-center gap-6 sm:gap-8">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1.5 group transition-transform active:scale-95"
                        >
                            <Heart
                                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${isLiked
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500 group-hover:scale-105'
                                    }`}
                            />
                            {likesCount > 0 && (
                                <span className={`text-sm sm:text-base font-medium tabular-nums ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 group-hover:text-red-500'}`}>
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        {/* Save/Bookmark */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 group transition-transform active:scale-95"
                        >
                            <Bookmark
                                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${isSaved
                                    ? 'fill-[#5D41E6] text-[#5D41E6]'
                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5D41E6] group-hover:scale-105'
                                    }`}
                            />
                            {savesCount > 0 && (
                                <span className={`text-sm sm:text-base font-medium tabular-nums ${isSaved ? 'text-[#5D41E6]' : 'text-gray-600 dark:text-gray-400 group-hover:text-[#5D41E6]'}`}>
                                    {savesCount}
                                </span>
                            )}
                        </button>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 group transition-transform active:scale-95"
                        >
                            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-105 transition-all duration-200" />
                            {quote.shares_count > 0 && (
                                <span className="text-sm sm:text-base font-medium tabular-nums text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                    {quote.shares_count}
                                </span>
                            )}
                        </button>

                        {/* Collection (if available) */}
                        {auth?.user && collections && collections.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCollectionModal(true);
                                }}
                                className="flex items-center gap-1.5 group transition-transform active:scale-90"
                                title="Add to Collection"
                            >
                                <Folder
                                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${quote.collection_ids && quote.collection_ids.length > 0
                                        ? 'fill-[#5D41E6] text-[#5D41E6]'
                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5D41E6]'
                                        }`}
                                />
                            </button>
                        )}
                    </div>

                    {/* Right: Views */}
                    {quote.views_count > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                            <span className="text-xs sm:text-sm font-medium tabular-nums">{quote.views_count}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <QuoteDetailModal
                quote={quote}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                processing={isDeleting}
            />

            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                quoteId={quote.id}
                onSubmit={handleReport}
            />

            <AddToCollectionModal
                show={showCollectionModal}
                onClose={() => setShowCollectionModal(false)}
                quote={quote}
                collections={collections}
            />

            <ShareModal
                show={showShareModal}
                onClose={() => setShowShareModal(false)}
                quote={quote}
                colorScheme={colorSchemes[quote.id % colorSchemes.length]}
                onShare={trackShare}
            />

            {/* Toast Notification */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                message={toastMessage}
                type={toastType}
            />

            {/* Auth Prompt Modal */}
            <AuthPromptModal
                show={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                action={authAction}
            />
        </div>
    );
}
