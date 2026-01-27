import { useState } from 'react';
import Modal from './Modal';
import { Flag, AlertCircle, MessageSquare, UserX, Copyright, MoreHorizontal, X } from 'lucide-react';

const REPORT_REASONS = [
    { id: 'spam', label: 'Spam or misleading', icon: AlertCircle },
    { id: 'inappropriate', label: 'Inappropriate content', icon: MessageSquare },
    { id: 'harassment', label: 'Harassment or hate speech', icon: UserX },
    { id: 'misinformation', label: 'False information', icon: Flag },
    { id: 'copyright', label: 'Copyright violation', icon: Copyright },
    { id: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function ReportModal({ show, onClose, quoteId, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!selectedReason) return;
        
        setIsSubmitting(true);
        onSubmit?.({ reason: selectedReason, description, quoteId });
        
        // Reset and close
        setTimeout(() => {
            setIsSubmitting(false);
            setSelectedReason('');
            setDescription('');
            onClose();
        }, 500);
    };

    const handleClose = () => {
        setSelectedReason('');
        setDescription('');
        onClose();
    };

    return (
        <>
            {/* Desktop Modal */}
            <div className="hidden md:block">
                <Modal show={show} onClose={handleClose} maxWidth="lg">
                    <div className="relative">
                        {/* Header with Close Button */}
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                                    <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Report Quote
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        Help us understand the problem
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Reasons Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {REPORT_REASONS.map((reason) => {
                                    const Icon = reason.icon;
                                    const isSelected = selectedReason === reason.id;
                                    
                                    return (
                                        <button
                                            key={reason.id}
                                            type="button"
                                            onClick={() => setSelectedReason(reason.id)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group ${
                                                isSelected
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-colors ${
                                                isSelected 
                                                    ? 'bg-red-100 dark:bg-red-900/30' 
                                                    : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-red-50 dark:group-hover:bg-red-900/20'
                                            }`}>
                                                <Icon className={`w-5 h-5 transition-colors ${
                                                    isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                                                }`} />
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${
                                                isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {reason.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Additional Details */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Additional details <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide more context..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-shadow"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedReason || isSubmitting}
                                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed shadow-lg shadow-red-500/20 disabled:shadow-none"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

            {/* Mobile Bottom Sheet */}
            <div className="md:hidden">
                {show && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                            onClick={handleClose}
                        />

                        {/* Bottom Sheet */}
                        <div 
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col transition-transform duration-300 ease-out"
                            style={{ animation: 'slideUp 0.3s ease-out' }}
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto flex-1">
                                <div className="p-6 pb-8">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                                            <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                Report Quote
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                Help us understand the problem
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reasons */}
                                    <div className="space-y-3 mb-6">
                                        {REPORT_REASONS.map((reason) => {
                                            const Icon = reason.icon;
                                            const isSelected = selectedReason === reason.id;
                                            
                                            return (
                                                <button
                                                    key={reason.id}
                                                    type="button"
                                                    onClick={() => setSelectedReason(reason.id)}
                                                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left active:scale-[0.98] ${
                                                        isSelected
                                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                                                            : 'border-gray-200 dark:border-gray-700 active:border-red-300'
                                                    }`}
                                                >
                                                    <div className={`p-2 rounded-lg transition-colors ${
                                                        isSelected 
                                                            ? 'bg-red-100 dark:bg-red-900/30' 
                                                            : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}>
                                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                                                    </div>
                                                    <span className={`font-medium ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {reason.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Additional Details */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Additional details <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide more context..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Action Buttons at Bottom */}
                            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedReason || isSubmitting}
                                        className="w-full py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold rounded-xl transition-colors disabled:cursor-not-allowed shadow-lg shadow-red-500/20 disabled:shadow-none active:scale-[0.98]"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
