import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Heart, Bookmark, Share2, Eye, ArrowLeft, Edit2, Trash2, MoreVertical, Flag } from 'lucide-react';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import ReportModal from '@/Components/ReportModal';
import ShareModal from '@/Components/ShareModal';
import QuoteMetaTags from '@/Components/QuoteMetaTags';

// Professional color schemes
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

export default function ShowQuote({ quote }) {
    const { auth } = usePage().props;
    const [isLiked, setIsLiked] = useState(quote.is_liked || false);
    const [isSaved, setIsSaved] = useState(quote.is_saved || false);
    const [likesCount, setLikesCount] = useState(quote.likes_count || 0);
    const [savesCount, setSavesCount] = useState(quote.saves_count || 0);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = auth?.user?.id === quote.user_id;
    const colorScheme = colorSchemes[quote.id % colorSchemes.length];

    const handleLike = () => {
        if (!auth?.user) {
            router.visit('/login');
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
            },
        });
    };

    const handleSave = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

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
        // Track share intent
        router.post(`/quotes/${quote.id}/share`, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [],
        });
    };

    const handleEdit = () => {
        router.visit(`/quotes/${quote.id}/edit`);
    };

    const handleDelete = () => {
        setShowMenu(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/quotes/${quote.id}`, {
            onSuccess: () => {
                // Redirect to home after successful deletion
                router.visit('/');
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

    return (
        <AppLayout title={`Quote by ${quote.author || 'Unknown'}`}>
            <QuoteMetaTags quote={quote} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Quote</h1>
                        <div className="w-10"></div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Quote Card */}
                    <div
                        className="rounded-3xl shadow-2xl overflow-hidden mb-6"
                        style={{
                            backgroundColor: colorScheme.bg,
                            borderLeft: `4px solid ${colorScheme.accent}`
                        }}
                    >
                        <div className="p-8">
                            {/* User Info */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: colorScheme.accent }}
                                    >
                                        {quote.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: colorScheme.text }}>
                                            {quote.user?.name || 'Anonymous'}
                                        </p>
                                        <p className="text-sm opacity-60" style={{ color: colorScheme.text }}>
                                            @{quote.user?.username || 'user'}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 rounded-full hover:bg-black/5 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" style={{ color: colorScheme.text }} />
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
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
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quote Content */}
                            <div className="mb-6">
                                <p
                                    className="text-3xl md:text-4xl font-serif leading-relaxed mb-4 font-medium"
                                    style={{ color: colorScheme.text }}
                                >
                                    "{quote.content}"
                                </p>
                                {quote.author && (
                                    <p
                                        className="text-xl font-semibold flex items-center gap-2"
                                        style={{ color: colorScheme.accent }}
                                    >
                                        <span className="w-12 h-0.5" style={{ backgroundColor: colorScheme.accent }}></span>
                                        {quote.author}
                                    </p>
                                )}
                                {quote.source && (
                                    <p className="text-sm mt-2 opacity-60" style={{ color: colorScheme.text }}>
                                        {quote.source}
                                    </p>
                                )}
                            </div>

                            {/* Categories */}
                            {quote.categories && quote.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {quote.categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium"
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
                            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: colorScheme.border }}>
                                <div className="flex items-center gap-6">
                                    {/* Like */}
                                    <button
                                        onClick={handleLike}
                                        className="flex items-center gap-2 group hover:scale-105 transition-transform"
                                    >
                                        <Heart
                                            className={`w-6 h-6 transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
                                                }`}
                                            style={{ color: isLiked ? '#EF4444' : colorScheme.text + '99' }}
                                        />
                                        <span className="text-base font-semibold" style={{ color: colorScheme.text }}>
                                            {likesCount}
                                        </span>
                                    </button>

                                    {/* Save */}
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 group hover:scale-105 transition-transform"
                                    >
                                        <Bookmark
                                            className={`w-6 h-6 transition-all ${isSaved ? 'fill-current' : ''}`}
                                            style={{ color: isSaved ? colorScheme.accent : colorScheme.text + '99' }}
                                        />
                                        <span className="text-base font-semibold" style={{ color: colorScheme.text }}>
                                            {savesCount}
                                        </span>
                                    </button>

                                    {/* Share */}
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 group hover:scale-105 transition-transform"
                                    >
                                        <Share2 className="w-6 h-6" style={{ color: colorScheme.text + '99' }} />
                                        <span className="text-base font-semibold" style={{ color: colorScheme.text }}>
                                            {quote.shares_count || 0}
                                        </span>
                                    </button>
                                </div>

                                {/* Views */}
                                <div className="flex items-center gap-2 opacity-60">
                                    <Eye className="w-6 h-6" style={{ color: colorScheme.text }} />
                                    <span className="text-base font-semibold" style={{ color: colorScheme.text }}>
                                        {quote.views_count || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    {quote.tags && quote.tags.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {quote.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

            {/* Share Modal */}
            <ShareModal
                show={showShareModal}
                onClose={() => setShowShareModal(false)}
                quote={quote}
                colorScheme={colorScheme}
            />
        </AppLayout>
    );
}
