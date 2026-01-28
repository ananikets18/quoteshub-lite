import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Collections" />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Folder className="w-8 h-8 mr-3 text-purple-600" />
                                My Collections
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Organize your saved quotes into custom collections
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            <FolderPlus className="w-4 h-4 mr-2" />
                            New Collection
                        </button>
                    </div>
                </div>

                {/* Collections Grid */}
                {collections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start space-x-3">
                                        <Folder className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/collections/${collection.slug}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-purple-600 block truncate"
                                            >
                                                {collection.name}
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {collection.quotes_count} quote{collection.quotes_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => openEditModal(collection)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(collection)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {collection.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {collection.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="inline-flex items-center text-xs text-gray-500">
                                        {collection.is_public ? (
                                            <>
                                                <Globe className="w-3 h-3 mr-1" />
                                                Public
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-3 h-3 mr-1" />
                                                Private
                                            </>
                                        )}
                                    </span>
                                    <Link
                                        href={`/collections/${collection.slug}`}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center"
                                    >
                                        View
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
                        <p className="text-gray-600 mb-6">
                            Create your first collection to organize your saved quotes
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            <FolderPlus className="w-5 h-5 mr-2" />
                            Create Collection
                        </button>
                    </div>
                )}
            </div>

            {/* Create Collection Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Collection</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Collection Name" />
                        <TextInput
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full"
                            placeholder="e.g., Motivational, Work Quotes, etc."
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            rows="3"
                            placeholder="What's this collection about?"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Make this collection public</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <SecondaryButton type="button" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit">Create Collection</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Collection Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Collection</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit-name" value="Collection Name" />
                        <TextInput
                            id="edit-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit-description" value="Description (optional)" />
                        <textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            rows="3"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Make this collection public</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <SecondaryButton type="button" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit">Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>

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

                    {deletingCollection && (
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>"{deletingCollection.name}"</strong>?
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                The quotes themselves will not be deleted, only removed from this collection.
                            </p>
                            {deletingCollection.quotes_count > 0 && (
                                <p className="text-sm text-yellow-600 mt-2">
                                    ⚠️ This collection contains {deletingCollection.quotes_count} quote{deletingCollection.quotes_count !== 1 ? 's' : ''}.
                                </p>
                            )}
                        </div>
                    )}

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
        </AuthenticatedLayout>
    );
}
