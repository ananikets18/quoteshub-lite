import { Head } from '@inertiajs/react';

export default function SeoHead({ title, description, keywords, image, type = 'website' }) {
    const defaultDescription = "Discover and share inspiring quotes from great minds. Join QuotesHub - your daily dose of wisdom, motivation, and community.";
    const defaultImage = '/images/og-image.png';
    const finalDescription = description || defaultDescription;
    const finalImage = image || defaultImage;

    return (
        <Head title={title}>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title ? `${title} - QuotesHub` : 'QuotesHub'} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title ? `${title} - QuotesHub` : 'QuotesHub'} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />
        </Head>
    );
}
