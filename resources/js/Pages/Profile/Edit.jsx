import { Head, Link } from '@inertiajs/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Profile" />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Profile Settings</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                            href={route('dashboard')}
                            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', textDecoration: 'none' }}
                        >
                            ← Back to Dashboard
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Logout
                        </Link>
                    </div>
                </div>

                {/* Profile Information Form */}
                <div style={{ marginBottom: '30px' }}>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Update Password Form */}
                <div style={{ marginBottom: '30px' }}>
                    <UpdatePasswordForm />
                </div>

                {/* Avatar Upload Section (Placeholder for now) */}
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Profile Picture</h2>
                    <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                        Upload a profile picture (Coming soon)
                    </p>
                    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', border: '2px dashed #ddd', borderRadius: '4px', textAlign: 'center' }}>
                        <p style={{ color: '#666' }}>Avatar upload functionality will be implemented here</p>
                    </div>
                </div>
            </div>
        </>
    );
}
