import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import { Shield, AlertTriangle, Users, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <SeoHead title="Admin Dashboard" description="Moderate and manage QuotesHub from the admin dashboard." />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Shield className="w-8 h-8 mr-3 text-purple-600" />
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Manage and moderate QuotesHub</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending Reports</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.pending_reports}</p>
                            </div>
                            <AlertTriangle className="w-12 h-12 text-orange-500" />
                        </div>
                        <Link
                            href="/admin/reports"
                            className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
                        >
                            Review reports →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
                            </div>
                            <Users className="w-12 h-12 text-blue-500" />
                        </div>
                        <Link
                            href="/admin/users"
                            className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
                        >
                            Manage users →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Quotes</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_quotes}</p>
                            </div>
                            <FileText className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Recent Reports</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.recent_reports}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/admin/reports?status=pending"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            <AlertTriangle className="w-8 h-8 text-orange-500 mr-4" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Review Pending Reports</h3>
                                <p className="text-sm text-gray-600">{stats.pending_reports} reports need attention</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            <Users className="w-8 h-8 text-blue-500 mr-4" />
                            <div>
                                <h3 className="font-semibold text-gray-900">User Management</h3>
                                <p className="text-sm text-gray-600">Manage {stats.total_users} users</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
