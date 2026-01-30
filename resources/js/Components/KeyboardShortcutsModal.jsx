import Modal from './Modal';
import { Keyboard, Command } from 'lucide-react';

export default function KeyboardShortcutsModal({ show, onClose, isAuthenticated }) {
    const shortcuts = [
        {
            category: 'Navigation',
            items: [
                { keys: ['H'], description: 'Go to Home/Feed' },
                { keys: ['C'], description: 'Create new quote', authRequired: true },
                { keys: ['N'], description: 'Go to Notifications', authRequired: true },
                { keys: ['A'], description: 'Go to Achievements', authRequired: true },
                { keys: ['P'], description: 'Go to Profile', authRequired: true },
                { keys: ['S'], description: 'Go to Saved/Collections', authRequired: true },
                { keys: ['/'], description: 'Focus search bar' },
            ],
        },
        {
            category: 'Feed Filters',
            items: [
                { keys: ['1'], description: 'For You feed', authRequired: true },
                { keys: ['2'], description: 'Latest feed' },
                { keys: ['3'], description: 'Trending feed' },
                { keys: ['4'], description: 'Featured feed' },
            ],
        },
        {
            category: 'Quote Actions',
            items: [
                { keys: ['L'], description: 'Like quote (when focused)', authRequired: true },
                { keys: ['B'], description: 'Bookmark/Save quote (when focused)', authRequired: true },
                { keys: ['S'], description: 'Share quote (when focused)', authRequired: true },
                { keys: ['R'], description: 'Report quote (when focused)', authRequired: true },
            ],
        },
        {
            category: 'Forms & Modals',
            items: [
                { keys: ['Ctrl', 'Enter'], description: 'Submit form/modal', mac: ['⌘', 'Enter'] },
                { keys: ['Esc'], description: 'Close modal/dialog' },
            ],
        },
        {
            category: 'Help',
            items: [
                { keys: ['?'], description: 'Show this help dialog' },
            ],
        },
    ];

    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const renderKey = (key, index, total) => {
        const isModifier = ['Ctrl', 'Cmd', 'Alt', 'Shift', '⌘', '⌥', '⇧'].includes(key);

        return (
            <span key={key} className="inline-flex items-center">
                <kbd className={`px-2 py-1 text-xs font-semibold rounded ${isModifier
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    } border border-gray-300 dark:border-gray-600`}>
                    {key}
                </kbd>
                {index < total - 1 && <span className="mx-1 text-gray-400">+</span>}
            </span>
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Keyboard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Keyboard Shortcuts
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Navigate faster with keyboard shortcuts
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shortcuts.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-purple-600 rounded"></div>
                                {section.category}
                            </h3>
                            <div className="space-y-2">
                                {section.items.map((item, index) => {
                                    // Skip auth-required shortcuts if not authenticated
                                    if (item.authRequired && !isAuthenticated) {
                                        return null;
                                    }

                                    const keys = isMac && item.mac ? item.mac : item.keys;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {item.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {keys.map((key, i) => renderKey(key, i, keys.length))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Command className="w-4 h-4" />
                        <span>
                            Pro tip: Press <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">?</kbd> anytime to view shortcuts
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
