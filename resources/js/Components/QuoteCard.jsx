import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Heart, Bookmark, Share2, Eye, MoreVertical } from 'lucide-react';
import QuoteDetailModal from './QuoteDetailModal';

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

export default function QuoteCard({ quote, compact = false }) {
    const [isLiked, setIsLiked] = useState(quote.is_liked || false);
    const [isSaved, setIsSaved] = useState(quote.is_saved || false);
    const [likesCount, setLikesCount] = useState(quote.likes_count || 0);
    const [savesCount, setSavesCount] = useState(quote.saves_count || 0);
    const [showModal, setShowModal] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();

        router.post(`/api/quotes/${quote.id}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLiked(!isLiked);
                setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
            },
        });
    };

    const handleSave = async (e) => {
        e.stopPropagation();

        router.post(`/api/quotes/${quote.id}/save`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaved(!isSaved);
                setSavesCount(isSaved ? savesCount - 1 : savesCount + 1);
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

                router.post(`/api/quotes/${quote.id}/share`, {}, {
                    preserveScroll: true,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    const handleCardClick = () => {
        setShowModal(true);
    };

    const colorScheme = colorSchemes[quote.id % colorSchemes.length];

    return (
        <div
            className="quote-card-professional cursor-pointer mb-4"
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

                    <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
                        <MoreVertical className="w-5 h-5" style={{ color: colorScheme.text }} />
                    </button>
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
        </div>
    );
}
