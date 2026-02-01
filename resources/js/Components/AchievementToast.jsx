import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

export default function AchievementToast({ achievement, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Slide in animation
        setTimeout(() => setIsVisible(true), 100);

        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!achievement || !achievement.definition) {
        return null;
    }

    const { definition } = achievement;

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${isVisible && !isLeaving
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                }`}
        >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-2xl p-4 max-w-sm">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                            {definition.icon}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-semibold uppercase tracking-wide">
                                Achievement Unlocked!
                            </span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{definition.name}</h4>
                        <p className="text-sm text-purple-100">{definition.description}</p>
                        <div className="mt-2 inline-flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs font-semibold">
                            <span>+{definition.points}</span>
                            <span className="text-yellow-300">★</span>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-white hover:text-purple-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-5000 ease-linear"
                        style={{ width: isVisible ? '0%' : '100%' }}
                    />
                </div>
            </div>
        </div>
    );
}
