import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/InputError';
import { useFormShortcuts } from '@/Hooks/useKeyboardShortcuts';
import {
    Type,
    Tag,
    Send,
    ArrowLeft,
    Check
} from 'lucide-react';

const DEFAULT_GRADIENT = null; // Removed


export default function CreateQuote({ categories }) {
    // Simplified state
    const { data, setData, post, processing, errors } = useForm({
        content: '',
        author: '',
        source: '',
        category_ids: [],
    });

    const [activeTab, setActiveTab] = useState('text'); // 'text', 'tags'

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!data.content || processing) return;

        post(route('quotes.store'), {
            onError: (errors) => {
                // Ensure the tab with errors is visible
                if (errors.content || errors.author || errors.source) {
                    setActiveTab('text');
                } else if (errors.category_ids) {
                    setActiveTab('tags');
                }
            }
        });
    };

    // Keyboard shortcut: Ctrl/Cmd + Enter to submit
    useFormShortcuts({
        onSubmit: handleSubmit,
        canSubmit: !!data.content && !processing,
    });

    const toggleCategory = (categoryId) => {
        if (data.category_ids.includes(categoryId)) {
            setData('category_ids', data.category_ids.filter(id => id !== categoryId));
        } else {
            setData('category_ids', [...data.category_ids, categoryId]);
        }
    };

    return (
        <AppLayout title="Create Quote" showHeader={false} showNav={false} showFooter={false}>
            <SeoHead
                title="Create a Quote"
                description="Share your favorite quotes or your own wisdom with the world. Create beautiful cards with custom backgrounds and topics."
            />
            {/* Custom Full Screen Layout */}
            <div className="h-screen flex flex-col bg-[#f7f4ef] dark:bg-gray-900 overflow-hidden">

                {/* 1. Top Bar */}
                <header className="px-6 lg:px-10 py-4 flex items-center justify-between bg-white/90 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 z-20 backdrop-blur">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">New Quote</h1>
                        <span className="hidden md:inline text-xs text-gray-400">Desktop studio</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={processing || !data.content}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${!data.content
                            ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-[#5D41E6] hover:bg-[#4b33c2] text-white shadow-lg hover:shadow-xl hover:scale-105'
                            }`}
                        title="Post quote (Ctrl+Enter)"
                    >
                        <span>Post</span>
                        <Send className="w-4 h-4" />
                    </button>
                </header>

                {/* 2. Main Content Area (Split View) */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* A. The Canvas (Preview) - Top on Mobile, Left on Desktop */}
                    <div className="relative flex-1 bg-[#efeae3] dark:bg-black/50 flex items-center justify-center p-6 md:p-12 lg:p-16 overflow-hidden transition-all duration-300 ease-in-out">
                        <div
                            className="w-full max-w-sm md:max-w-md xl:max-w-lg aspect-[4/5] md:aspect-[4/4.2] rounded-[32px] shadow-[0_30px_80px_rgba(76,66,53,0.25)] flex flex-col items-center justify-center text-center p-10 md:p-12 transition-all duration-500 ease-out border border-white/60 bg-white/95 dark:bg-gray-800"
                        >
                            <div className="overflow-y-auto max-h-full w-full no-scrollbar flex flex-col items-center justify-center space-y-4">
                                <span className="text-xs uppercase tracking-[0.35em] text-gray-400">Draft</span>
                                <p
                                    className={`font-serif leading-relaxed break-words whitespace-pre-wrap transition-all duration-300 font-medium text-gray-900 dark:text-white ${data.content.length > 200 ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl xl:text-5xl'}`}
                                >
                                    {data.content || 'Start typing to create your masterpiece...'}
                                </p>

                                {(data.author || data.source) && (
                                    <div className="space-y-1 animate-fade-in">
                                        {data.author && (
                                            <p className="font-semibold text-lg flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
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
                        <div className="absolute inset-0 opacity-40 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#c7b9a4 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                        />
                    </div>

                    {/* B. The Controls (Tools) - Bottom on Mobile, Right on Desktop */}
                    <div className="bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 w-full md:w-[420px] lg:w-[460px] flex flex-col shrink-0 h-[45vh] md:h-auto z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">

                        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Quote Studio</p>
                            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Craft the details</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Shape the text and tags that travel with your quote.</p>
                        </div>

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
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500 min-h-[140px] lg:min-h-[180px] text-lg resize-none placeholder-gray-400"
                                            autoFocus
                                        />
                                        <div className="flex justify-end">
                                            <span className={`text-xs ${data.content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {data.content.length}/500
                                            </span>
                                        </div>
                                        <InputError message={errors.content} className="mt-2" />
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
                                            <InputError message={errors.author} className="mt-2" />
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
                                            <InputError message={errors.source} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* 3. TAG TOOLS */}
                            {activeTab === 'tags' && (
                                <div className="space-y-4 animate-fade-in">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topics</label>
                                    {categories && categories.length > 0 ? (
                                        <>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((category) => {
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
                                        </>
                                    ) : (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                                                No topics available yet
                                            </p>
                                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                                You can still create quotes! Topics are optional and help with discovery.
                                            </p>
                                        </div>
                                    )}
                                    <InputError message={errors.category_ids} className="mt-2" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
