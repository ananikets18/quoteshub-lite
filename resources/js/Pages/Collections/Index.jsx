import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import { FolderPlus, Folder, Lock, Globe, Trash2, Edit, ChevronRight, AlertTriangle } from 'lucide-react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, collections }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [deletingCollection, setDeletingCollection] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_public: false,
    });
    const [errors, setErrors] = useState({});

    const handleCreate = (e) => {
        e.preventDefault();
        router.post('/collections', formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setFormData({ name: '', description: '', is_public: false });
                setErrors({});
            },
            onError: (errors) => setErrors(errors),
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        router.patch(`/collections/${editingCollection.slug}`, formData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingCollection(null);
                setFormData({ name: '', description: '', is_public: false });
                setErrors({});
            },
            onError: (errors) => setErrors(errors),
        });
    };

    const handleDelete = () => {
        if (!deletingCollection) return;

        setIsDeleting(true);
        router.delete(`/collections/${deletingCollection.slug}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletingCollection(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const openDeleteModal = (collection) => {
        setDeletingCollection(collection);
        setShowDeleteModal(true);
    };

    const openEditModal = (collection) => {
        setEditingCollection(collection);
        setFormData({
            name: collection.name,
            description: collection.description || '',
            is_public: collection.is_public,
        });
        setShowEditModal(true);
    };

    return (
        <AppLayout user={auth.user} showNav={true}>
            <SeoHead
                title="My Collections"
                description="Organize your favorite quotes into custom collections. Keep them private or share them with the community."
            />

            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl mr-3">
                                    <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-[#5D41E6] dark:text-purple-400" />
                                </div>
                                My Collections
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 ml-0 sm:ml-14">
                                Organize your saved quotes into custom collections
                            </p>
                        </div>
                        {collections.length > 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] hover:shadow-xl text-white font-semibold rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
                            >
                                <FolderPlus className="w-4 h-4 mr-2" />
                                New Collection
                            </button>
                        )}
                    </div>
                </div>

                {/* Collections Grid */}
                {collections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all p-6 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                                            <Folder className="w-5 h-5 text-[#5D41E6] dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/collections/${collection.slug}`}
                                                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-[#5D41E6] dark:hover:text-purple-400 block truncate transition-colors"
                                            >
                                                {collection.name}
                                            </Link>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                                {collection.quotes_count} quote{collection.quotes_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(collection)}
                                            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-[#5D41E6] hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(collection)}
                                            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {collection.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {collection.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
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
                                    <Link
                                        href={`/collections/${collection.slug}`}
                                        className="text-[#5D41E6] dark:text-purple-400 hover:text-[#4b33c2] dark:hover:text-purple-300 text-sm font-bold inline-flex items-center transition-all hover:gap-2 gap-1"
                                    >
                                        View
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 sm:p-16 text-center">
                        <div className="max-w-sm mx-auto">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Folder className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No collections yet</h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                                Create your first collection to organize your saved quotes
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] hover:shadow-xl text-white font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                <FolderPlus className="w-5 h-5 mr-2" />
                                Create Collection
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Collection Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md">
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start mb-4 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <FolderPlus className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Create New Collection</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Organize your favorite quotes</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Collection Name
                            </label>
                            <TextInput
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full text-sm sm:text-base"
                                placeholder="e.g., Motivational, Work Quotes, etc."
                                required
                                autoFocus
                                maxLength={100}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full text-sm sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 rounded-lg shadow-sm transition-colors"
                                rows={3}
                                placeholder="What's this collection about?"
                                maxLength={500}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="pt-1 sm:pt-2">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.is_public}
                                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-purple-600 shadow-sm focus:ring-purple-500 dark:focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-colors flex-shrink-0"
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
                                onClick={() => setShowCreateModal(false)}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-all shadow-sm"
                            >
                                Create Collection
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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
                            <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Collection Name
                            </label>
                            <TextInput
                                id="edit-name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full text-sm sm:text-base"
                                required
                                autoFocus
                                maxLength={100}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full text-sm sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 rounded-lg shadow-sm transition-colors"
                                rows={3}
                                maxLength={500}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="pt-1 sm:pt-2">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.is_public}
                                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-purple-600 shadow-sm focus:ring-purple-500 dark:focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-colors flex-shrink-0"
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
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 transition-all shadow-sm"
                            >
                                Save Changes
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

                    {deletingCollection && (
                        <div className="mb-4 sm:mb-6">
                            <p className="text-gray-900 dark:text-white">
                                Are you sure you want to delete <strong>"{deletingCollection.name}"</strong>?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                The quotes themselves will not be deleted, only removed from this collection.
                            </p>
                            {deletingCollection.quotes_count > 0 && (
                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                                    This collection contains {deletingCollection.quotes_count} quote{deletingCollection.quotes_count !== 1 ? 's' : ''}.
                                </p>
                            )}
                        </div>
                    )}

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
        </AppLayout>
    );
}
