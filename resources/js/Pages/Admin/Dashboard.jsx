import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import { Shield, AlertTriangle, Users, FileText, TrendingUp, Activity, Eye, MessageSquare, BarChart3, Clock, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <SeoHead title="Admin Dashboard" description="Moderate and manage QuotesHub from the admin dashboard." />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                                    <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mr-4">
                                        <Shield className="w-8 h-8 text-white" />
                                    </div>
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600 mt-3 text-lg">Manage and moderate QuotesHub with powerful insights</p>
                            </div>
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="flex items-center text-sm text-orange-600 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    12%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending_reports}</p>
                                <p className="text-sm text-gray-600 mt-1">Pending Reports</p>
                            </div>
                            <Link
                                href="/admin/reports"
                                className="flex items-center text-sm text-orange-600 hover:text-orange-700 mt-4 font-medium group"
                            >
                                Review reports
                                <ArrowUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex items-center text-sm text-green-600 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    8%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Users</p>
                            </div>
                            <Link
                                href="/admin/users"
                                className="flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium group"
                            >
                                Manage users
                                <ArrowUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <FileText className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex items-center text-sm text-green-600 font-medium">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    24%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_quotes}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Quotes</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-4">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                <span>+{Math.floor(stats.total_quotes * 0.24)} this month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex items-center text-sm text-red-600 font-medium">
                                    <ArrowDown className="w-4 h-4 mr-1" />
                                    5%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.recent_reports}</p>
                                <p className="text-sm text-gray-600 mt-1">Recent Reports</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-4">
                                <Activity className="w-4 h-4 mr-1" />
                                <span>Last 7 days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Activity className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/admin/reports?status=pending"
                                        className="group flex items-center p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-orange-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-700">Review Pending Reports</h3>
                                            <p className="text-sm text-gray-600 mt-1">{stats.pending_reports} reports need attention</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/users"
                                        className="group flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-blue-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">User Management</h3>
                                            <p className="text-sm text-gray-600 mt-1">Manage {stats.total_users} users</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/reports"
                                        className="group flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-green-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-green-700">View All Reports</h3>
                                            <p className="text-sm text-gray-600 mt-1">Review content moderation</p>
                                        </div>
                                    </Link>

                                    <div className="group flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer">
                                        <div className="p-3 bg-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">Analytics</h3>
                                            <p className="text-sm text-gray-600 mt-1">View detailed insights</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">New report filed</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Users className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">New user registered</p>
                                            <p className="text-xs text-gray-500">15 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <FileText className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Quote approved</p>
                                            <p className="text-xs text-gray-500">1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <MessageSquare className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Report resolved</p>
                                            <p className="text-xs text-gray-500">3 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-6 text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
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
