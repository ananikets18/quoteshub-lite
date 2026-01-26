import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const nameRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        // Prevent double submission
        if (processing) {
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            preserveScroll: true,
        });
    };

    // Auto-focus name on mount
    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    return (
        <>
            <Head title="Register" />

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Register</h1>

                <form onSubmit={submit} noValidate>
                    {/* Name */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Full Name
                        </label>
                        <input
                            ref={nameRef}
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.name ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        {errors.name && (
                            <div id="name-error" role="alert" style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoComplete="username"
                            aria-invalid={errors.username ? 'true' : 'false'}
                            aria-describedby={errors.username ? 'username-error' : undefined}
                            disabled={processing}
                            placeholder="letters, numbers, dashes, underscores"
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.username ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        {errors.username && (
                            <div id="username-error" role="alert" style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {errors.username}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
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
                            <div id="email-error" role="alert" style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="new-password"
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error password-hint' : 'password-hint'}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.password ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        <div id="password-hint" style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                            Minimum 8 characters, must include letters and numbers
                        </div>
                        {errors.password && (
                            <div id="password-error" role="alert" style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password_confirmation" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            autoComplete="new-password"
                            aria-invalid={errors.password_confirmation ? 'true' : 'false'}
                            aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.password_confirmation ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                opacity: processing ? 0.6 : 1
                            }}
                        />
                        {errors.password_confirmation && (
                            <div id="password-confirmation-error" role="alert" style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {errors.password_confirmation}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                            href={route('login')}
                            style={{ color: '#0066cc', textDecoration: 'underline' }}
                            tabIndex={processing ? -1 : 0}
                        >
                            Already registered?
                        </Link>
                        <button
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
                            {processing ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
