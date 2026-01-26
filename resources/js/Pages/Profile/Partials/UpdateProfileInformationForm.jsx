import { useForm, usePage, Link } from '@inertiajs/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Profile Information</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Update your account's profile information and email address.
            </p>

            <form onSubmit={submit}>
                {/* Name */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.name && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.name}</div>}
                </div>

                {/* Username */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
                    <input
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.username && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.username}</div>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
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

                {/* Bio */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows="3"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }}
                    />
                    {errors.bio && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.bio}</div>}
                </div>

                {/* Website */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="website" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Website</label>
                    <input
                        id="website"
                        type="url"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        placeholder="https://example.com"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.website && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.website}</div>}
                </div>

                {/* Location */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
                    <input
                        id="location"
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        placeholder="City, Country"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {errors.location && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.location}</div>}
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '15px' }}>
                        <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                            Your email address is unverified.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            style={{ color: '#0066cc', textDecoration: 'underline', fontSize: '14px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                            Click here to re-send the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div style={{ color: '#28a745', fontSize: '14px', marginTop: '5px' }}>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

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
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                    {recentlySuccessful && (
                        <span style={{ color: '#28a745', fontSize: '14px' }}>✓ Saved successfully!</span>
                    )}
                </div>
            </form>
        </div>
    );
}
