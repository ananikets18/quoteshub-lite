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
        setIsSaved(quote.is_saved || false);
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

    const handleLike = (e) => {
        e.stopPropagation();

        // Check authentication
        if (!auth?.user) {
            setAuthAction('like');
            setShowAuthModal(true);
            return;
        }

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
                showNotification('Failed to update like. Please try again.', 'error');
            },
        });
    };

    const handleSave = (e) => {
        e.stopPropagation();

        // Check authentication
        if (!auth?.user) {
            setAuthAction('save');
            setShowAuthModal(true);
            return;
        }

        // Optimistic update - instant UI feedback
        const newIsSaved = !isSaved;
        const wasUnsaved = isSaved && !newIsSaved;

        setIsSaved(newIsSaved);
        setSavesCount(newIsSaved ? savesCount + 1 : savesCount - 1);

        // If unsaving and callback provided (e.g., from Saved page), trigger fade out
        if (wasUnsaved && onUnsave) {
            setIsFadingOut(true);
            setTimeout(() => {
                onUnsave(quote.id);
            }, 300); // Match the transition duration
        }

        // Background sync with server
        router.post(`/quotes/${quote.id}/save`, {}, {
            preserveState: true,
            preserveScroll: true,
            only: [],
            onError: () => {
                // Revert on error
                setIsSaved(!newIsSaved);
                setSavesCount(newIsSaved ? savesCount : savesCount + 1);
                setIsFadingOut(false);
                showNotification('Failed to save quote. Please try again.', 'error');
            },
        });
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

        // Track share count
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
            {/* Clean Card Container - Instagram/Twitter Style */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700/50">

                {/* Header: User Info */}
                <div className="flex items-center justify-between px-3 sm:px-4 pt-2 sm:pt-3 pb-1.5 sm:pb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5D41E6] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm">
                            {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        {/* User Details */}
                        <div className="flex flex-col">
                            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white leading-tight">
                                {quote.user?.name || 'Anonymous'}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                @{quote.user?.username || 'user'}
                            </span>
                        </div>
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
                <div className="px-3 sm:px-4 py-2 sm:py-3">
                    {/* Quote Text - Primary Focus */}
                    <p className="text-[15px] sm:text-base md:text-lg leading-relaxed text-gray-900 dark:text-white mb-2 sm:mb-3 font-medium">
                        "{quote.content}"
                    </p>

                    {/* Author & Source - Secondary Info */}
                    {(quote.author || quote.source) && (
                        <div className="mt-2 sm:mt-2.5 space-y-0.5">
                            {quote.author && (
                                <p className="text-xs sm:text-sm font-semibold text-[#5D41E6] dark:text-purple-400">
                                    — {quote.author}
                                </p>
                            )}
                            {quote.source && (
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    {quote.source}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Categories - Minimal Pills */}
                    {quote.categories && quote.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                            {quote.categories.slice(0, 3).map((category) => (
                                <span
                                    key={category.id}
                                    className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                                >
                                    <span className="text-[9px] sm:text-[10px]">{category.icon}</span>
                                    <span>{category.name}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Bar - Instagram Style */}
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
                    {/* Left Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 sm:gap-1.5 group -ml-1"
                        >
                            <div className="p-1 sm:p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                                <Heart
                                    className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-all ${isLiked
                                        ? 'fill-red-500 text-red-500 scale-105'
                                        : 'text-gray-600 dark:text-gray-400 group-hover:text-red-500'
                                        }`}
                                />
                            </div>
                            {likesCount > 0 && (
                                <span className={`text-xs sm:text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        {/* Save/Bookmark */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 sm:gap-1.5 group"
                        >
                            <div className="p-1 sm:p-1.5 rounded-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                                <Bookmark
                                    className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-all ${isSaved
                                        ? 'fill-[#5D41E6] text-[#5D41E6] scale-105'
                                        : 'text-gray-600 dark:text-gray-400 group-hover:text-[#5D41E6]'
                                        }`}
                                />
                            </div>
                            {savesCount > 0 && (
                                <span className={`text-xs sm:text-sm font-medium ${isSaved ? 'text-[#5D41E6]' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {savesCount}
                                </span>
                            )}
                        </button>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 sm:gap-1.5 group"
                        >
                            <div className="p-1 sm:p-1.5 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors">
                                <Share2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
                            </div>
                            {quote.shares_count > 0 && (
                                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
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
                                className="flex items-center gap-1 sm:gap-1.5 group"
                                title="Add to Collection"
                            >
                                <div className="p-1 sm:p-1.5 rounded-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                                    <Folder
                                        className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-all ${quote.collection_ids && quote.collection_ids.length > 0
                                            ? 'fill-[#5D41E6] text-[#5D41E6]'
                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-[#5D41E6]'
                                            }`}
                                    />
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Right: Views */}
                    {quote.views_count > 0 && (
                        <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 dark:text-gray-400">
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-medium">{quote.views_count}</span>
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
