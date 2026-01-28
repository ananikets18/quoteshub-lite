import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Folder, Lock, Globe, Edit, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Show({ auth, collection, quotes, isOwner, collections = [] }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRemoveQuoteModal, setShowRemoveQuoteModal] = useState(false);
    const [quoteToRemove, setQuoteToRemove] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={collection.name} />

            <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/collections"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collections
                </Link>

                {/* Collection Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Folder className="w-8 h-8 mr-3 text-purple-600" />
                                {collection.name}
                            </h1>
                            {collection.description && (
                                <p className="text-gray-600 mt-2">{collection.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-4 text-sm">
                                <span className="inline-flex items-center text-gray-500">
                                    {collection.is_public ? (
                                        <>
                                            <Globe className="w-4 h-4 mr-1" />
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-1" />
                                            Private
                                        </>
                                    )}
                                </span>
                                <span className="text-gray-500">
                                    {quotes.total} quote{quotes.total !== 1 ? 's' : ''}
                                </span>
                                <span className="text-gray-500">
                                    Created {new Date(collection.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex space-x-2">
                                <Link
                                    href="#"
                                    className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition shadow-sm"
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
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Collection is empty</h3>
                        <p className="text-gray-600 mb-6">
                            {isOwner 
                                ? "Start adding quotes to this collection from your saved quotes!"
                                : "This collection doesn't have any quotes yet."
                            }
                        </p>
                        {isOwner && (
                            <Link
                                href={route('profile.saved')}
                                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                            >
                                View Saved Quotes
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Collection Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Delete Collection</h3>
                            <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700">
                            Are you sure you want to delete <strong>"{collection.name}"</strong>?
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            The quotes themselves will not be deleted, only removed from this collection.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Collection'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Remove Quote Modal */}
            <Modal show={showRemoveQuoteModal} onClose={() => setShowRemoveQuoteModal(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Remove Quote</h3>
                            <p className="text-sm text-gray-600 mt-1">Remove from this collection</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700">
                            Are you sure you want to remove this quote from <strong>"{collection.name}"</strong>?
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            The quote will still be available in your saved quotes and other collections.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowRemoveQuoteModal(false)} disabled={isDeleting}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleRemoveQuote} disabled={isDeleting}>
                            {isDeleting ? 'Removing...' : 'Remove Quote'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
