import { Head } from '@inertiajs/react';

export default function QuoteMetaTags({ quote }) {
    const title = `"${quote.content.substring(0, 60)}${quote.content.length > 60 ? '...' : ''}" - ${quote.author || 'Unknown'}`;
    const description = `${quote.content} - ${quote.author || 'Unknown'}. Discover and share inspiring quotes on QuotesHub.`;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    // Generate a simple OG image URL (you can create a backend endpoint to generate dynamic images)
    const ogImage = `/api/og-image/${quote.id}`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional */}
            <link rel="canonical" href={url} />
        </Head>
    );
}
