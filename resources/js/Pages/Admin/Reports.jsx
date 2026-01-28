import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
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

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            action_taken: 'bg-green-100 text-green-800',
            dismissed: 'bg-gray-100 text-gray-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
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
            <Head title="Reports Management" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <AlertTriangle className="w-8 h-8 mr-3 text-orange-600" />
                        Reports Management
                    </h1>
                    <p className="text-gray-600 mt-2">Review and moderate reported content</p>
                </div>

                {/* Status Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex space-x-2">
                        {['all', 'pending', 'reviewed', 'action_taken', 'dismissed'].map((status) => (
                            <Link
                                key={status}
                                href={`/admin/reports?status=${status}`}
                                className={`px-4 py-2 rounded-lg transition ${
                                    currentStatus === status
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Reports List */}
                {reports.data.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {reports.data.map((report) => (
                                <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                                                    {report.status.replace('_', ' ')}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {getReasonLabel(report.reason)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Reported by <span className="font-medium">{report.user.name}</span> on {new Date(report.created_at).toLocaleDateString()}
                                            </p>
                                            {report.details && (
                                                <p className="text-sm text-gray-700 mt-2">
                                                    <MessageSquare className="w-4 h-4 inline mr-1" />
                                                    {report.details}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reported Quote */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-gray-900 mb-2">"{report.quote.content}"</p>
                                        <p className="text-sm text-gray-600">
                                            by {report.quote.author || 'Unknown'} • Posted by {report.quote.user.name}
                                        </p>
                                    </div>

                                    {/* Review Info */}
                                    {report.reviewed_at && (
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-blue-900">
                                                Reviewed by <span className="font-medium">{report.reviewer?.name}</span> on {new Date(report.reviewed_at).toLocaleDateString()}
                                            </p>
                                            {report.admin_notes && (
                                                <p className="text-sm text-blue-800 mt-2">{report.admin_notes}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {report.status === 'pending' && (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleReview(report, 'dismiss')}
                                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Dismiss
                                            </button>
                                            <button
                                                onClick={() => handleReview(report, 'warn')}
                                                className="inline-flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition"
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Warn User
                                            </button>
                                            <button
                                                onClick={() => handleReview(report, 'remove')}
                                                className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Remove Quote
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {reports.links.length > 3 && (
                            <Pagination links={reports.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                        <p className="text-gray-600">
                            {currentStatus === 'pending' 
                                ? "All caught up! No pending reports."
                                : `No ${currentStatus} reports.`
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Confirm Action: {action.charAt(0).toUpperCase() + action.slice(1)}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes (optional)
                        </label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            rows="3"
                            placeholder="Add any notes about this decision..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
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
