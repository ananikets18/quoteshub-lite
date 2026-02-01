import { Head } from '@inertiajs/react';

const APP_NAME = 'QuotesHub';
const DEFAULT_DESCRIPTION = "Discover and share inspiring quotes from great minds. Join QuotesHub - your daily dose of wisdom, motivation, and community.";

export default function SeoHead({ title, description, keywords, image, type = 'website' }) {
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const defaultImagePath = '/images/og-image.png';
    const finalImage = image || (origin ? `${origin}${defaultImagePath}` : defaultImagePath);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <Head title={title}>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title ? `${title} - ${APP_NAME}` : APP_NAME} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:site_name" content={APP_NAME} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title ? `${title} - ${APP_NAME}` : APP_NAME} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Canonical */}
            {url && <link rel="canonical" href={url} />}
        </Head>
    );
}
