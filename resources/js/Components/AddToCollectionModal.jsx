import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { Check, Folder, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function AddToCollectionModal({ quote, collections, show, onClose }) {
    const [selectedCollections, setSelectedCollections] = useState(quote.collection_ids || []);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleToggleCollection = (collectionId) => {
        const isCurrentlyInCollection = selectedCollections.includes(collectionId);
        const collection = collections.find(c => c.id === collectionId);

        if (!collection) {
            showToast('Collection not found', 'error');
            return;
        }

        setIsProcessing(true);

        if (isCurrentlyInCollection) {
            // Optimistically update UI
            setSelectedCollections(selectedCollections.filter(id => id !== collectionId));
            
            // Remove from collection
            router.delete(`/collections/${collection.slug}/quotes/${quote.id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    showToast(`Removed from "${collection.name}"`, 'success');
                    setIsProcessing(false);
                },
                onError: (errors) => {
                    // Revert on error
                    setSelectedCollections([...selectedCollections, collectionId]);
                    showToast('Failed to remove from collection', 'error');
                    setIsProcessing(false);
                    console.error('Delete error:', errors);
                },
            });
        } else {
            // Optimistically update UI
            setSelectedCollections([...selectedCollections, collectionId]);
            
            // Add to collection
            router.post(`/collections/${collection.slug}/quotes/${quote.id}`, {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    showToast(`Added to "${collection.name}"`, 'success');
                    setIsProcessing(false);
                },
                onError: (errors) => {
                    // Revert on error
                    setSelectedCollections(selectedCollections.filter(id => id !== collectionId));
                    showToast('Failed to add to collection', 'error');
                    setIsProcessing(false);
                    console.error('Post error:', errors);
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Folder className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Add to Collection
                </h2>

                {collections.length > 0 ? (
                    <div className="space-y-2 mb-6">
                        {collections.map((collection) => {
                            const isInCollection = selectedCollections.includes(collection.id);
                            
                            return (
                                <button
                                    key={collection.id}
                                    onClick={() => handleToggleCollection(collection.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                                        isInCollection
                                            ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                                    }`}
                                    disabled={isProcessing}
                                >
                                    <div className="flex items-center">
                                        <Folder className={`w-4 h-4 mr-2 ${isInCollection ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                        <span className={`font-medium ${isInCollection ? 'text-purple-900 dark:text-purple-200' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {collection.name}
                                        </span>
                                    </div>
                                    {isInCollection && (
                                        <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any collections yet</p>
                        <SecondaryButton
                            onClick={() => {
                                onClose();
                                router.visit('/collections');
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Collection
                        </SecondaryButton>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <SecondaryButton onClick={onClose}>
                        Close
                    </SecondaryButton>
                    {collections.length > 0 && (
                        <PrimaryButton
                            onClick={() => {
                                onClose();
                                router.visit('/collections');
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Collection
                        </PrimaryButton>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-4 right-4 z-[60] animate-slide-up">
                    <div className={`${
                        toast.type === 'success' 
                            ? 'bg-green-600' 
                            : 'bg-red-600'
                    } text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </Modal>
    );
}
