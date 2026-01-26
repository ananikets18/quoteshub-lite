import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm() {
    const { data, setData, put, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Update Password</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Ensure your account is using a long, random password to stay secure.
            </p>

            <form onSubmit={submit}>
                {/* Current Password */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="current_password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        required
                        autoComplete="current-password"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.current_password && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.current_password}</div>
                    )}
                </div>

                {/* New Password */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.password && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>
                    )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password_confirmation" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        autoComplete="new-password"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.password_confirmation && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password_confirmation}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#0066cc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            opacity: processing ? 0.6 : 1
                        }}
                    >
                        {processing ? 'Updating...' : 'Update Password'}
                    </button>
                    {recentlySuccessful && (
                        <span style={{ color: '#28a745', fontSize: '14px' }}>✓ Password updated successfully!</span>
                    )}
                </div>
            </form>
        </div>
    );
}
