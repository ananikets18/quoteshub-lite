import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ initialValue = '' }) {
    const [query, setQuery] = useState(initialValue || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.get('/search', { q: query });
        }
    };

    const handleClear = () => {
        setQuery('');
        router.get('/search');
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
            <div className={`relative flex items-center transition ${
                isFocused ? 'ring-2 ring-purple-500' : ''
            } rounded-lg bg-white shadow-sm`}>
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search quotes, authors, or users..."
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-0 focus:outline-none focus:ring-0"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </form>
    );
}
