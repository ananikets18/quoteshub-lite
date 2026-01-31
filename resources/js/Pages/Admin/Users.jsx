import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import Pagination from '@/Components/Pagination';
import { Users, Search, Shield, User, Ban, Check, X, AlertTriangle, Trash2, Filter, Calendar, Mail, Activity, Crown, Eye, EyeOff } from 'lucide-react';

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

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    User Management
                                </h1>
                                <p className="text-gray-600 mt-3 text-lg">Manage user accounts and permissions</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{users.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{users.data.filter(u => u.is_active).length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Active Users</p>
                            <p className="text-xs text-gray-500">Currently active</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <X className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{users.data.filter(u => !u.is_active).length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Inactive Users</p>
                            <p className="text-xs text-gray-500">Deactivated</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Crown className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{users.data.filter(u => u.role === 'admin').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Admins</p>
                            <p className="text-xs text-gray-500">Administrators</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{users.data.filter(u => u.role === 'user').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Regular Users</p>
                            <p className="text-xs text-gray-500">Standard accounts</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Search & Filter Users</h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                {users.total} users found
                            </div>
                        </div>
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name, username, or email..."
                                        className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 focus:ring-2"
                                    />
                                </div>
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 focus:ring-2 px-4 py-3"
                            >
                                <option value="">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                            </select>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    {users.data.length > 0 ? (
                        <>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Stats
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.data.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <img
                                                                    src={avatarUrl(user)}
                                                                    alt={user.name}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                                />
                                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                                                    user.is_active ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <Link
                                                                    href={`/${user.username}`}
                                                                    className="text-sm font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                                                                >
                                                                    {user.name}
                                                                </Link>
                                                                <div className="text-sm text-gray-500">@{user.username}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            user.role === 'admin'
                                                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                                                : 'bg-gray-100 text-gray-800 border-gray-200'
                                                        }`}>
                                                            {user.role === 'admin' ? <Crown className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-center">
                                                                <p className="font-semibold">{user.quotes_count}</p>
                                                                <p className="text-xs text-gray-500">Quotes</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            user.is_active
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : 'bg-red-100 text-red-800 border-red-200'
                                                        }`}>
                                                            {user.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                                            {user.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            {user.role !== 'admin' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => toggleUserStatus(user)}
                                                                        className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                                                                            user.is_active 
                                                                                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                                                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                                                                        }`}
                                                                    >
                                                                        {user.is_active ? <Ban className="w-3 h-3 mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                                                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => changeUserRole(user, 'admin')}
                                                                        className="inline-flex items-center px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all duration-200"
                                                                    >
                                                                        <Crown className="w-3 h-3 mr-1" />
                                                                        Admin
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteUser(user)}
                                                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-all duration-200"
                                                                    >
                                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                            {user.role === 'admin' && user.id !== auth.user.id && (
                                                                <button
                                                                    onClick={() => changeUserRole(user, 'user')}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
                                                                >
                                                                    <User className="w-3 h-3 mr-1" />
                                                                    Remove Admin
                                                                </button>
                                                            )}
                                                            {user.id === auth.user.id && (
                                                                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg font-medium">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {users.links.length > 3 && (
                                <div className="mt-8">
                                    <Pagination links={users.links} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="p-4 bg-gray-100 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No users found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setRole('');
                                    router.get('/admin/users', {});
                                }}
                                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
        </AuthenticatedLayout>
    );
}
