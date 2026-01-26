import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Register</h1>

                <form onSubmit={submit}>
                    {/* Name */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.name && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.name}</div>}
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                        <input
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.username && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.username}</div>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
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

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password_confirmation" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.password_confirmation && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password_confirmation}</div>}
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link href={route('login')} style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Already registered?
                        </Link>
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
                            {processing ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
