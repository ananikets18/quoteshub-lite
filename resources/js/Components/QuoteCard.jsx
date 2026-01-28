import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Heart, Bookmark, Share2, Eye, MoreVertical, Edit2, Trash2, Flag, EyeOff, CheckCircle } from 'lucide-react';
import QuoteDetailModal from './QuoteDetailModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ReportModal from './ReportModal';
import axios from 'axios';

// Professional color schemes with subtle accents
const colorSchemes = [
    { bg: '#FFFFFF', accent: '#8B5CF6', text: '#1F2937', border: '#E5E7EB' }, // Purple accent
    { bg: '#FEFCE8', accent: '#EAB308', text: '#1F2937', border: '#FEF08A' }, // Yellow accent
    { bg: '#F0FDF4', accent: '#10B981', text: '#1F2937', border: '#BBF7D0' }, // Green accent
    { bg: '#FFF7ED', accent: '#F97316', text: '#1F2937', border: '#FED7AA' }, // Orange accent
    { bg: '#FDF2F8', accent: '#EC4899', text: '#1F2937', border: '#FBCFE8' }, // Pink accent
    { bg: '#EFF6FF', accent: '#3B82F6', text: '#1F2937', border: '#DBEAFE' }, // Blue accent
    { bg: '#F5F3FF', accent: '#A855F7', text: '#1F2937', border: '#E9D5FF' }, // Violet accent
    { bg: '#ECFDF5', accent: '#14B8A6', text: '#1F2937', border: '#99F6E4' }, // Teal accent
];

export default function QuoteCard({ quote, compact = false, auth }) {
    const [isLiked, setIsLiked] = useState(quote.is_liked || false);
    const [isSaved, setIsSaved] = useState(quote.is_saved || false);
    const [likesCount, setLikesCount] = useState(quote.likes_count || 0);
    const [savesCount, setSavesCount] = useState(quote.saves_count || 0);
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const isOwner = auth?.user?.id === quote.user_id;

    // Don't render if deleted or hidden (not interested)
    if (isDeleted || isHidden) {
        return null;
    }

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
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

    const handleShare = async (e) => {
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Quote from QuotesHub',
                    text: `"${quote.content}" - ${quote.author || 'Unknown'}`,
                    url: window.location.origin + `/quotes/${quote.id}`,
                });

                router.post(`/quotes/${quote.id}/share`, {}, {
                    preserveScroll: true,
                    preserveState: true,
                    only: [],
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    const handleCardClick = () => {
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
            },
            onError: () => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                alert('Failed to delete quote. Please try again.');
            },
        });
    };

    const handleReport = (data) => {
        router.post(`/quotes/${quote.id}/report`, data, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Report submitted successfully!');
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
                showNotification('Quote hidden. We\'ll show you less like this.');
                
                // Start fade out animation
                setIsFadingOut(true);
                
                // Remove from DOM after animation
                setTimeout(() => {
                    setIsHidden(true);
                }, 500);
            }
        } catch (error) {
            console.error('Failed to mark as not interested:', error);
            showNotification('Failed to update preference. Please try again.');
        }
    };

    const colorScheme = colorSchemes[quote.id % colorSchemes.length];

    return (
        <div
            className={`quote-card-professional cursor-pointer mb-4 transition-opacity duration-500 ${
                isFadingOut ? 'opacity-0 scale-95' : 'opacity-100'
            }`}
            onClick={handleCardClick}
            style={{
                backgroundColor: colorScheme.bg,
                borderColor: colorScheme.border,
                color: colorScheme.text
            }}
        >
            {/* Accent border on left */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: colorScheme.accent }}
            />

            {/* Content */}
            <div className="relative z-10 p-6">
                {/* User Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: colorScheme.accent }}
                        >
                            {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: colorScheme.text }}>
                                {quote.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs opacity-60" style={{ color: colorScheme.text }}>
                                @{quote.user?.username || 'user'}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" style={{ color: colorScheme.text }} />
                        </button>

                            {showMenu && (
                                <div 
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isOwner ? (
                                        <>
                                            <button
                                                onClick={handleEdit}
                                                className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span>Edit Quote</span>
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Quote</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {auth?.user && (
                                                <button
                                                    onClick={handleNotInterested}
                                                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                                >
                                                    <EyeOff className="w-4 h-4" />
                                                    <span>Not Interested</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowReportModal(true);
                                                }}
                                                className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                            >
                                                <Flag className="w-4 h-4" />
                                                <span>Report Quote</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quote Text */}
                    <div className={`${compact ? 'mb-3' : 'mb-6'}`}>
                        <p 
                            className={`${compact ? 'text-lg' : 'text-2xl'} font-serif leading-relaxed mb-3 font-medium`}
                            style={{ color: colorScheme.text }}
                        >
                            "{quote.content}"
                        </p>
                        {quote.author && (
                        <p 
                            className={`${compact ? 'text-sm' : 'text-base'} font-semibold flex items-center gap-2`}
                            style={{ color: colorScheme.accent }}
                        >
                            <span className="w-8 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                            {quote.author}
                        </p>
                    )}
                    {quote.source && (
                        <p className="text-xs mt-1 opacity-60" style={{ color: colorScheme.text }}>
                            {quote.source}
                        </p>
                    )}
                </div>

                {/* Categories */}
                {quote.categories && quote.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {quote.categories.slice(0, 3).map((category) => (
                            <span
                                key={category.id}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                                style={{ 
                                    backgroundColor: `${colorScheme.accent}15`,
                                    color: colorScheme.accent 
                                }}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colorScheme.border }}>
                    <div className="flex items-center gap-6">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 group"
                        >
                            <Heart
                                className={`w-5 h-5 transition-all ${
                                    isLiked
                                        ? 'fill-red-500 text-red-500'
                                        : 'hover:text-red-500 group-hover:scale-110'
                                }`}
                                style={{ color: isLiked ? '#EF4444' : colorScheme.text + '99' }}
                            />
                            <span className="text-sm font-medium" style={{ color: colorScheme.text }}>{likesCount}</span>
                        </button>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 group"
                        >
                            <Bookmark
                                className={`w-5 h-5 transition-all ${
                                    isSaved
                                        ? 'fill-current'
                                        : 'group-hover:scale-110'
                                }`}
                                style={{ color: isSaved ? colorScheme.accent : colorScheme.text + '99' }}
                            />
                            <span className="text-sm font-medium" style={{ color: colorScheme.text }}>{savesCount}</span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 group"
                        >
                            <Share2 
                                className="w-5 h-5 group-hover:scale-110 transition-all" 
                                style={{ color: colorScheme.text + '99' }}
                            />
                            <span className="text-sm font-medium" style={{ color: colorScheme.text }}>{quote.shares_count || 0}</span>
                        </button>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-2 opacity-60">
                        <Eye className="w-5 h-5" style={{ color: colorScheme.text }} />
                        <span className="text-sm font-medium" style={{ color: colorScheme.text }}>{quote.views_count || 0}</span>
                    </div>
                </div>
            </div>

            {/* Quote Detail Modal */}
            <QuoteDetailModal
                quote={quote}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                processing={isDeleting}
            />

            {/* Report Modal */}
            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                quoteId={quote.id}
                onSubmit={handleReport}
            />

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 dark:text-green-600" />
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
