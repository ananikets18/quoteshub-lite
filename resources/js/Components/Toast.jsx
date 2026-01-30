import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ show, onClose, message, type = 'info', duration = 3000 }) {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const types = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: CheckCircle,
            iconColor: 'text-green-500 dark:text-green-400',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: AlertCircle,
            iconColor: 'text-red-500 dark:text-red-400',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: AlertTriangle,
            iconColor: 'text-yellow-500 dark:text-yellow-400',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: Info,
            iconColor: 'text-blue-500 dark:text-blue-400',
        },
    };

    const config = types[type] || types.info;
    const Icon = config.icon;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up max-w-md w-full px-4">
            <div className={`${config.bg} ${config.border} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
                <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                <p className={`${config.text} text-sm font-medium flex-1`}>{message}</p>
                <button
                    onClick={onClose}
                    className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
