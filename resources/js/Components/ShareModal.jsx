import { useState } from 'react';
import { X, Download, Copy, Check, Twitter, Facebook, Linkedin, MessageCircle, Instagram } from 'lucide-react';
import QuoteImageGenerator from './QuoteImageGenerator';

export default function ShareModal({ show, onClose, quote, colorScheme, onShare }) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('share'); // 'share' or 'download'

    if (!show) return null;

    // Generate the specific quote URL
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/quotes/${quote.id}` : '';
    const shareText = `"${quote.content}" - ${quote.author || 'Unknown'}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            // Track successful share
            if (onShare) onShare();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
        // Track share action
        if (onShare) onShare();
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
        // Track share action
        if (onShare) onShare();
    };

    const handleLinkedInShare = () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank', 'width=550,height=420');
        // Track share action
        if (onShare) onShare();
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');
        // Track share action
        if (onShare) onShare();
    };

    const handleEmailShare = () => {
        const subject = encodeURIComponent('Check out this quote from QuotesHub');
        const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        // Track share action
        if (onShare) onShare();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Share Quote
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('share')}
                        className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-colors ${activeTab === 'share'
                            ? 'text-[#5D41E6] dark:text-purple-400 border-b-2 border-[#5D41E6] dark:border-purple-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Share
                    </button>
                    <button
                        onClick={() => setActiveTab('download')}
                        className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-colors ${activeTab === 'download'
                            ? 'text-[#5D41E6] dark:text-purple-400 border-b-2 border-[#5D41E6] dark:border-purple-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Download
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {activeTab === 'share' ? (
                        <div className="space-y-4">
                            {/* Copy Link */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Share Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-xs sm:text-sm"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#5D41E6] hover:bg-[#4b33c2] text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span className="hidden sm:inline">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span className="hidden sm:inline">Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Social Media Buttons */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Share on Social Media
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {/* Twitter */}
                                    <button
                                        onClick={handleTwitterShare}
                                        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        onClick={handleFacebookShare}
                                        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                    >
                                        <Facebook className="w-4 h-4" />
                                        Facebook
                                    </button>

                                    {/* LinkedIn */}
                                    <button
                                        onClick={handleLinkedInShare}
                                        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </button>

                                    {/* WhatsApp */}
                                    <button
                                        onClick={handleWhatsAppShare}
                                        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </button>

                                    {/* Email */}
                                    <button
                                        onClick={handleEmailShare}
                                        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email
                                    </button>

                                    {/* Native Share (Mobile) */}
                                    {navigator.share && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await navigator.share({
                                                        title: 'Quote from QuotesHub',
                                                        text: shareText,
                                                        url: shareUrl,
                                                    });
                                                    // Track successful share
                                                    if (onShare) onShare();
                                                } catch (err) {
                                                    // User cancelled share - silently ignore
                                                }
                                            }}
                                            className="flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-[#5D41E6] hover:bg-[#4b33c2] text-white rounded-lg font-medium text-xs sm:text-sm transition-all hover:scale-105"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                            More
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quote Preview */}
                            <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Preview:</p>
                                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium italic leading-relaxed">"{quote.content}"</p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">— {quote.author || 'Unknown'}</p>
                            </div>
                        </div>
                    ) : (
                        <QuoteImageGenerator quote={quote} colorScheme={colorScheme} onDownload={onShare} />
                    )}
                </div>
            </div>
        </div>
    );
}
