import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeoHead from '@/Components/SeoHead';
import Pagination from '@/Components/Pagination';
import { AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Filter, Calendar, User, Flag, Clock, RefreshCw } from 'lucide-react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Reports({ auth, reports, currentStatus }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const handleReview = (report, selectedAction) => {
        setSelectedReport(report);
        setAction(selectedAction);
        setAdminNotes('');
        setShowModal(true);
    };

    const submitReview = () => {
        router.post(`/admin/reports/${selectedReport.id}/review`, {
            action,
            admin_notes: adminNotes,
        }, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedReport(null);
            },
        });
    };

    const getReasonLabel = (reason) => {
        const labels = {
            spam: 'Spam',
            inappropriate: 'Inappropriate Content',
            copyright: 'Copyright Violation',
            misinformation: 'Misinformation',
            harassment: 'Harassment',
            other: 'Other',
        };
        return labels[reason] || reason;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <SeoHead title="Reports Management" description="Review and manage content reports on QuotesHub admin." />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                                    <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl mr-4">
                                        <AlertTriangle className="w-8 h-8 text-white" />
                                    </div>
                                    Reports Management
                                </h1>
                                <p className="text-gray-600 mt-3 text-lg">Review and moderate reported content</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </button>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Reports</p>
                                    <p className="text-2xl font-bold text-gray-900">{reports.total}</p>
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
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{reports.data.filter(r => r.status === 'pending').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Pending</p>
                            <p className="text-xs text-gray-500">Awaiting review</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{reports.data.filter(r => r.status === 'reviewed').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Reviewed</p>
                            <p className="text-xs text-gray-500">Under review</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{reports.data.filter(r => r.status === 'action_taken').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Action Taken</p>
                            <p className="text-xs text-gray-500">Resolved</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <XCircle className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{reports.data.filter(r => r.status === 'dismissed').length}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Dismissed</p>
                            <p className="text-xs text-gray-500">Not actionable</p>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Filter by Status</h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                Showing: {currentStatus === 'all' ? 'All Reports' : currentStatus.replace('_', ' ').charAt(0).toUpperCase() + currentStatus.replace('_', ' ').slice(1)}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['all', 'pending', 'reviewed', 'action_taken', 'dismissed'].map((status) => {
                                const count = status === 'all' ? reports.total : reports.data.filter(r => r.status === status).length;
                                const isActive = currentStatus === status;
                                return (
                                    <Link
                                        key={status}
                                        href={`/admin/reports?status=${status}`}
                                        className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
                                            {count > 0 && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reports List */}
                    {reports.data.length > 0 ? (
                        <>
                            <div className="space-y-6">
                                {reports.data.map((report) => (
                                    <div key={report.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                        {/* Report Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                            report.status === 'reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            report.status === 'action_taken' ? 'bg-green-100 text-green-800 border-green-200' :
                                                            'bg-gray-100 text-gray-800 border-gray-200'
                                                        }`}>
                                                            {report.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                                                            {report.status === 'reviewed' && <Eye className="w-3 h-3 inline mr-1" />}
                                                            {report.status === 'action_taken' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                                            {report.status === 'dismissed' && <XCircle className="w-3 h-3 inline mr-1" />}
                                                            {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.replace('_', ' ').slice(1)}
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                                            <Flag className="w-3 h-3 inline mr-1" />
                                                            {getReasonLabel(report.reason)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Report Content */}
                                        <div className="p-6">
                                            {/* Reporter Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Reported by {report.user.name}</p>
                                                    <p className="text-xs text-gray-500">@{report.user.username} • {new Date(report.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>

                                            {/* Report Details */}
                                            {report.details && (
                                                <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                                                    <div className="flex items-start space-x-2">
                                                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-900 mb-1">Report Details</p>
                                                            <p className="text-sm text-blue-800">{report.details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Reported Quote */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-4 border border-gray-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-lg text-gray-900 mb-3 italic">"{report.quote.content}"</p>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="font-medium">{report.quote.author || 'Unknown'}</span>
                                                            <span>•</span>
                                                            <span>Posted by {report.quote.user.name}</span>
                                                            <span>•</span>
                                                            <Link href={`/${report.quote.user.username}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                                                @{report.quote.user.username}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Review Info */}
                                            {report.reviewed_at && (
                                                <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                                                    <div className="flex items-start space-x-2">
                                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-green-900 mb-1">
                                                                Reviewed by {report.reviewer?.name} on {new Date(report.reviewed_at).toLocaleDateString()}
                                                            </p>
                                                            {report.admin_notes && (
                                                                <p className="text-sm text-green-800">{report.admin_notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            {report.status === 'pending' && (
                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={() => handleReview(report, 'dismiss')}
                                                        className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 group"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                        Dismiss
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(report, 'warn')}
                                                        className="inline-flex items-center px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-medium transition-all duration-200 group"
                                                    >
                                                        <AlertTriangle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                        Warn User
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(report, 'remove')}
                                                        className="inline-flex items-center px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-all duration-200 group"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                        Remove Quote
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {reports.links.length > 3 && (
                                <div className="mt-8">
                                    <Pagination links={reports.links} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="p-4 bg-gray-100 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No reports found</h3>
                            <p className="text-gray-600 mb-6">
                                {currentStatus === 'pending' 
                                    ? "All caught up! No pending reports to review."
                                    : `No ${currentStatus.replace('_', ' ')} reports found.`
                                }
                            </p>
                            <Link
                                href="/admin/reports?status=pending"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                            >
                                View Pending Reports
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className={`p-3 rounded-xl ${
                            action === 'dismiss' ? 'bg-gray-100 text-gray-600' :
                            action === 'warn' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                        }`}>
                            {action === 'dismiss' && <XCircle className="w-6 h-6" />}
                            {action === 'warn' && <AlertTriangle className="w-6 h-6" />}
                            {action === 'remove' && <CheckCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Confirm Action: {action.charAt(0).toUpperCase() + action.slice(1)}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {action === 'dismiss' && 'This report will be marked as dismissed and no action will be taken.'}
                                {action === 'warn' && 'A warning will be sent to the user who posted the quote.'}
                                {action === 'remove' && 'The quote will be permanently removed from the platform.'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes (optional)
                        </label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full border-gray-300 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2"
                            rows="4"
                            placeholder="Add any notes about this decision..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <SecondaryButton onClick={() => setShowModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton onClick={submitReview}>
                            Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
