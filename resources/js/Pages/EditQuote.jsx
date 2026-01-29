import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Type,
    Type,
    Tag,
    Save,
    ArrowLeft,
    Check
} from 'lucide-react';

export default function EditQuote({ quote, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        content: quote.content || '',
        author: quote.author || '',
        source: quote.source || '',
        category_ids: quote.categories?.map(c => c.id) || [],
    });

    const [activeTab, setActiveTab] = useState('text'); // 'text', 'tags'

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('quotes.update', quote.id));
    };

    const toggleCategory = (categoryId) => {
        if (data.category_ids.includes(categoryId)) {
            setData('category_ids', data.category_ids.filter(id => id !== categoryId));
        } else {
            setData('category_ids', [...data.category_ids, categoryId]);
        }
    };

    return (
        <AppLayout title="Edit Quote" showHeader={false} showNav={false}>
            {/* Custom Full Screen Layout */}
            <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">

                {/* 1. Top Bar */}
                <header className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 z-20">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">Edit Quote</h1>
                    <button
                        onClick={handleSubmit}
                        disabled={processing || !data.content}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${!data.content
                            ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            }`}
                    >
                        <span>Update</span>
                        <Save className="w-4 h-4" />
                    </button>
                </header>

                {/* 2. Main Content Area (Split View) */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* A. The Canvas (Preview) - Top on Mobile, Left on Desktop */}
                    <div className="relative flex-1 bg-gray-100 dark:bg-black/50 flex items-center justify-center p-6 md:p-12 overflow-hidden transition-all duration-300 ease-in-out">
                        <div
                            className="w-full max-w-sm md:max-w-md aspect-[4/5] md:aspect-square rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center p-8 transition-all duration-500 ease-out border-l-4 bg-white dark:bg-gray-800 border-l-purple-600"
                        >
                            <div className="overflow-y-auto max-h-full w-full no-scrollbar flex flex-col items-center justify-center space-y-4">
                                <p
                                    className={`font-serif leading-relaxed break-words whitespace-pre-wrap transition-all duration-300 font-medium text-gray-900 dark:text-white ${data.content.length > 200 ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'}`}
                                >
                                    {data.content || 'Start typing to edit your quote...'}
                                </p>

                                {(data.author || data.source) && (
                                    <div className="space-y-1 animate-fade-in">
                                        {data.author && (
                                            <p
                                                className="font-semibold text-lg flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400"
                                            >
                                                <span className="w-8 h-0.5 bg-purple-600 dark:bg-purple-400"></span>
                                                {data.author}
                                                <span className="w-8 h-0.5 bg-purple-600 dark:bg-purple-400"></span>
                                            </p>
                                        )}
                                        {data.source && (
                                            <p className="text-sm italic opacity-60 text-gray-500 dark:text-gray-400">{data.source}</p>
                                        )}
                                    </div>
                                )}

                                {data.category_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center pt-4">
                                        {categories
                                            .filter(c => data.category_ids.includes(c.id))
                                            .map(c => (
                                                <span
                                                    key={c.id}
                                                    className="text-xs px-3 py-1 rounded-full font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                >
                                                    {c.icon} {c.name}
                                                </span>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Pattern (Optional Aesthetic) */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                        />
                    </div>

                    {/* B. The Controls (Tools) - Bottom on Mobile, Right on Desktop */}
                    <div className="bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 w-full md:w-[400px] flex flex-col shrink-0 h-[45vh] md:h-auto z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-100 dark:border-gray-800">
                            {[
                                { id: 'text', icon: Type, label: 'Content' },
                                { id: 'tags', icon: Tag, label: 'Topics' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === tab.id
                                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/10'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                    <span className="text-xs font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tools Content Area (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">

                            {/* 1. TEXT TOOLS */}
                            {activeTab === 'text' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quote</label>
                                        <textarea
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="What's on your mind?"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500 min-h-[120px] text-lg resize-none placeholder-gray-400"
                                            autoFocus
                                        />
                                        <div className="flex justify-end">
                                            <span className={`text-xs ${data.content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {data.content.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                                            <input
                                                type="text"
                                                value={data.author}
                                                onChange={(e) => setData('author', e.target.value)}
                                                placeholder="e.g. Steve Jobs"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Source (Optional)</label>
                                            <input
                                                type="text"
                                                value={data.source}
                                                onChange={(e) => setData('source', e.target.value)}
                                                placeholder="e.g. Stanford Speech"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. TAG TOOLS */}
                            {activeTab === 'tags' && (
                                <div className="space-y-4 animate-fade-in">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topics</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories?.map((category) => {
                                            const isSelected = data.category_ids.includes(category.id);
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(category.id)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${isSelected
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span>{category.icon}</span>
                                                    <span>{category.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 text-center pt-4">
                                        Select up to 3 topics to help people find your quote.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
