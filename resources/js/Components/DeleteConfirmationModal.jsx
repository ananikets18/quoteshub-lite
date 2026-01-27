import Modal from './Modal';
import DangerButton from './DangerButton';
import SecondaryButton from './SecondaryButton';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Delete Quote",
    message = "Are you sure you want to delete this quote? This action cannot be undone.",
    confirmText = "Delete",
    processing = false 
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                {/* Icon */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>

                {/* Content */}
                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 justify-end">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Cancel
                    </SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        {processing ? 'Deleting...' : confirmText}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
