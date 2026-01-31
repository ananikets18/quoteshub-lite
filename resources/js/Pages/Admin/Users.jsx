import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import Pagination from '@/Components/Pagination';
import { Users, Search, Shield, User, Ban, Check, X, AlertTriangle, Trash2 } from 'lucide-react';

export default function UsersManagement({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'toggle', 'role', 'delete'
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role }, {
            preserveState: true,
        });
    };

    const toggleUserStatus = (user) => {
        setSelectedUser(user);
        setModalAction('toggle');
        setShowModal(true);
    };

    const changeUserRole = (user, roleValue) => {
        setSelectedUser(user);
        setNewRole(roleValue);
        setModalAction('role');
        setShowModal(true);
    };

    const deleteUser = (user) => {
        setSelectedUser(user);
        setModalAction('delete');
        setShowModal(true);
    };

    const confirmAction = () => {
        setProcessing(true);

        if (modalAction === 'toggle') {
            router.patch(`/admin/users/${selectedUser.id}`, {
                is_active: !selectedUser.is_active,
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setShowModal(false);
                },
            });
        } else if (modalAction === 'role') {
            router.patch(`/admin/users/${selectedUser.id}`, {
                role: newRole,
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setShowModal(false);
                },
            });
        } else if (modalAction === 'delete') {
            router.delete(`/admin/users/${selectedUser.id}`, {
                onFinish: () => {
                    setProcessing(false);
                    setShowModal(false);
                },
            });
        }
    };

    const getModalContent = () => {
        if (!selectedUser) return null;

        switch (modalAction) {
            case 'toggle':
                return {
                    title: selectedUser.is_active ? 'Deactivate User' : 'Activate User',
                    message: `Are you sure you want to ${selectedUser.is_active ? 'deactivate' : 'activate'} ${selectedUser.name}?`,
                    icon: selectedUser.is_active ? Ban : Check,
                    color: selectedUser.is_active ? 'red' : 'green',
                    confirmText: selectedUser.is_active ? 'Deactivate' : 'Activate',
                };
            case 'role':
                return {
                    title: 'Change User Role',
                    message: `Change ${selectedUser.name}'s role to ${newRole}?`,
                    icon: Shield,
                    color: 'blue',
                    confirmText: 'Change Role',
                };
            case 'delete':
                return {
                    title: 'Delete User',
                    message: `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`,
                    icon: Trash2,
                    color: 'red',
                    confirmText: 'Delete User',
                };
            default:
                return null;
        }
    };

    const avatarUrl = (user) => user.avatar
        ? `/storage/${user.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <SeoHead title="User Management" description="Manage user accounts and permissions on QuotesHub admin." />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Users className="w-8 h-8 mr-3 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, username, or email..."
                                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                {users.data.length > 0 ? (
                    <>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quotes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={avatarUrl(user)}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <Link
                                                            href={`/${user.username}`}
                                                            className="text-sm font-medium text-gray-900 hover:text-purple-600"
                                                        >
                                                            {user.name}
                                                        </Link>
                                                        <div className="text-sm text-gray-500">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role === 'admin' ? <Shield className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.quotes_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.is_active ? <Check className="w-3 h-3 inline mr-1" /> : <X className="w-3 h-3 inline mr-1" />}
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => toggleUserStatus(user)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => changeUserRole(user, 'admin')}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            Make Admin
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {user.role === 'admin' && user.id !== auth.user.id && (
                                                    <button
                                                        onClick={() => changeUserRole(user, 'user')}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        Remove Admin
                                                    </button>
                                                )}
                                                {user.id === auth.user.id && (
                                                    <span className="text-gray-400">You</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.links.length > 3 && (
                            <Pagination links={users.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                            {(() => {
                                const content = getModalContent();
                                const Icon = content.icon;
                                const colorClasses = {
                                    red: 'bg-red-100 text-red-600',
                                    green: 'bg-green-100 text-green-600',
                                    blue: 'bg-blue-100 text-blue-600',
                                };

                                return (
                                    <>
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-full ${colorClasses[content.color]} dark:${colorClasses[content.color]} flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {content.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                disabled={processing}
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            {content.message}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                disabled={processing}
                                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmAction}
                                                disabled={processing}
                                                className={`flex-1 px-4 py-2.5 ${content.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                                                        content.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                                                            'bg-blue-600 hover:bg-blue-700'
                                                    } text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon className="w-4 h-4" />
                                                        {content.confirmText}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
