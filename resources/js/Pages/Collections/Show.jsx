import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Folder, Lock, Globe, Edit, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Show({ auth, collection, quotes, isOwner, collections = [] }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveQuoteModal, setShowRemoveQuoteModal] = useState(false);
    const [quoteToRemove, setQuoteToRemove] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: collection.name,
        description: collection.description || '',
        is_public: collection.is_public,
    });

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/collections/${collection.slug}`, {
            onSuccess: () => router.visit('/collections'),
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleRemoveQuote = () => {
        if (!quoteToRemove) return;

        setIsDeleting(true);
        router.delete(`/collections/${collection.slug}/quotes/${quoteToRemove}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowRemoveQuoteModal(false);
                setQuoteToRemove(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const openRemoveQuoteModal = (quoteId) => {
        setQuoteToRemove(quoteId);
        setShowRemoveQuoteModal(true);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        patch(`/collections/${collection.slug}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    return (
        <AppLayout user={auth.user} showNav={true}>
            <SeoHead
                title={`${collection.name} - Collection`}
                description={collection.description || `Explore the "${collection.name}" collection on QuotesHub. A curated set of inspiring quotes.`}
            />

            <div className="px-4 py-6 pb-20">
                {/* Back Link */}
                <Link
                    href="/collections"
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collections
                </Link>

                {/* Collection Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex-shrink-0">
                                    <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                                        {collection.name}
                                    </h1>
                                </div>
                            </div>
                            
                            {collection.description && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2 ml-0 sm:ml-11 leading-relaxed">{collection.description}</p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-3 mt-4 ml-0 sm:ml-11 text-sm">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-full">
                                    {collection.is_public ? (
                                        <>
                                            <Globe className="w-3 h-3" />
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3 h-3" />
                                            Private
                                        </>
                                    )}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {quotes.total} quote{quotes.total !== 1 ? 's' : ''}
                                </span>
                                <span className="text-gray-500 dark:text-gray-500 text-xs">
                                    Created {new Date(collection.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors shadow-sm"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-xl transition-colors shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quotes Grid */}
                {quotes.data.length > 0 ? (
                    <>
                        <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {quotes.data.map((quote) => (
                                <div key={quote.id} className="relative">
                                    <QuoteCard
                                        quote={quote}
                                        auth={auth}
                                        collections={collections}
                                    />
                                    {isOwner && (
                                        <button
                                            onClick={() => openRemoveQuoteModal(quote.id)}
                                            className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition shadow-sm z-10"
                                            title="Remove from collection"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {quotes.links.length > 3 && (
                            <Pagination links={quotes.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Folder className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collection is empty</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {isOwner
                                ? "Start adding quotes to this collection from your saved quotes!"
                                : "This collection doesn't have any quotes yet."
                            }
                        </p>
                        {isOwner && (
                            <Link
                                href={route('saved')}
                                className="inline-flex items-center px-6 py-3 bg-[#5D41E6] hover:bg-[#4b33c2] text-white font-semibold rounded-full hover:shadow-lg transition-all"
                            >
                                View Saved Quotes
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Collection Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md">
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start mb-4 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <Edit className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Edit Collection</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Update your collection details</p>
                        </div>
                    </div>

                    <form onSubmit={handleEdit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Collection Name
                            </label>
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full text-sm sm:text-base"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                                maxLength={100}
                                placeholder="Enter collection name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                id="description"
                                className="mt-1 block w-full text-sm sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 rounded-lg shadow-sm transition-colors"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                maxLength={500}
                                placeholder="Add a description for your collection"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="pt-1 sm:pt-2">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-purple-600 shadow-sm focus:ring-purple-500 dark:focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-colors flex-shrink-0"
                                    checked={data.is_public}
                                    onChange={(e) => setData('is_public', e.target.checked)}
                                />
                                <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        Make this collection public
                                    </span>
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                        Public collections can be viewed by anyone
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                disabled={processing}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Collection Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="md">
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start mb-4 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Delete Collection</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    <div className="mb-4 sm:mb-6">
                        <p className="text-gray-900 dark:text-white">
                            Are you sure you want to delete <strong>"{collection.name}"</strong>?
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            The quotes themselves will not be deleted, only removed from this collection.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Collection'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Remove Quote Modal */}
            <Modal show={showRemoveQuoteModal} onClose={() => setShowRemoveQuoteModal(false)} maxWidth="md">
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start mb-4 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Remove Quote</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Remove from this collection</p>
                        </div>
                    </div>

                    <div className="mb-4 sm:mb-6">
                        <p className="text-gray-900 dark:text-white">
                            Are you sure you want to remove this quote from <strong>"{collection.name}"</strong>?
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            The quote will still be available in your saved quotes and other collections.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setShowRemoveQuoteModal(false)}
                            disabled={isDeleting}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveQuote}
                            disabled={isDeleting}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {isDeleting ? 'Removing...' : 'Remove Quote'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
