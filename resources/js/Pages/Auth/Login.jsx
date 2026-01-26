import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const rememberRef = useRef(null);
    const submitRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        // Prevent double submission
        if (processing) {
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
            preserveScroll: true,
        });
    };

    // Auto-focus email on mount
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <>
            <Head title="Login" />

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Login</h1>

                {/* Status Messages */}
                {status && (
                    <div
                        role="alert"
                        aria-live="polite"
                        style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}
                    >
                        {status}
                    </div>
                )}

                <form onSubmit={submit} noValidate>
                    {/* Email */}
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="email"
                            style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}
                        >
                            Email Address
                        </label>
                        <input
                            ref={emailRef}
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    passwordRef.current?.focus();
                                }
                            }}
                            required
                            autoComplete="email"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.email ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        {errors.email && (
                            <div
                                id="email-error"
                                role="alert"
                                style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}
                            >
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="password"
                            style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}
                        >
                            Password
                        </label>
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    rememberRef.current?.focus();
                                }
                            }}
                            required
                            autoComplete="current-password"
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.password ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        {errors.password && (
                            <div
                                id="password-error"
                                role="alert"
                                style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}
                            >
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                ref={rememberRef}
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        submitRef.current?.focus();
                                    }
                                }}
                                disabled={processing}
                                style={{ marginRight: '8px' }}
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button and Links */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '14px' }}
                                    tabIndex={processing ? -1 : 0}
                                >
                                    Forgot password?
                                </Link>
                            )}
                            <Link
                                href={route('register')}
                                style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '14px' }}
                                tabIndex={processing ? -1 : 0}
                            >
                                Register
                            </Link>
                        </div>
                        <button
                            ref={submitRef}
                            type="submit"
                            disabled={processing}
                            aria-busy={processing}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: processing ? '#6c757d' : '#0066cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.6 : 1,
                                transition: 'all 0.2s'
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
