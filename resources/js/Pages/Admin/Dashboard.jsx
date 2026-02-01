import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import { Shield, AlertTriangle, Users, FileText, TrendingUp, Activity, Eye, MessageSquare, BarChart3, Clock, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <SeoHead title="Admin Dashboard" description="Moderate and manage QuotesHub from the admin dashboard." />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mr-4">
                                        <Shield className="w-8 h-8 text-white" />
                                    </div>
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">Manage and moderate QuotesHub with powerful insights</p>
                            </div>
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    12%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending_reports}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Pending Reports</p>
                            </div>
                            <Link
                                href="/admin/reports"
                                className="flex items-center text-sm text-orange-600 hover:text-orange-700 mt-4 font-medium group"
                            >
                                Review reports
                                <ArrowUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    8%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_users}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Total Users</p>
                            </div>
                            <Link
                                href="/admin/users"
                                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-4 font-medium group"
                            >
                                Manage users
                                <ArrowUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    24%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_quotes}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Total Quotes</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                <span>+{Math.floor(stats.total_quotes * 0.24)} this month</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
                                    <ArrowDown className="w-4 h-4 mr-1" />
                                    5%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recent_reports}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Recent Reports</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                <Activity className="w-4 h-4 mr-1" />
                                <span>Last 7 days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Activity className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/admin/reports?status=pending"
                                        className="group flex items-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-orange-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-300">Review Pending Reports</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stats.pending_reports} reports need attention</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/users"
                                        className="group flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-blue-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">User Management</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage {stats.total_users} users</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/reports"
                                        className="group flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-green-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">View All Reports</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Review content moderation</p>
                                        </div>
                                    </Link>

                                    <div className="group flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 cursor-pointer">
                                        <div className="p-3 bg-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">Analytics</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">View detailed insights</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">New report filed</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Quote approved</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Report resolved</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-6 text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                                    View all activity →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
