import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Login</h1>

                {status && <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>{status}</div>}

                <form onSubmit={submit}>
                    {/* Email */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.password && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
                    </div>

                    {/* Remember Me */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button and Links */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {canResetPassword && (
                                <Link href={route('password.request')} style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '14px' }}>
                                    Forgot password?
                                </Link>
                            )}
                            <Link href={route('register')} style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '14px' }}>
                                Register
                            </Link>
                        </div>
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
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
