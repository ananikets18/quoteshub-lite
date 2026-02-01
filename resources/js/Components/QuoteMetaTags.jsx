import { Head } from '@inertiajs/react';

const APP_NAME = 'QuotesHub';

export default function QuoteMetaTags({ quote }) {
    const baseTitle = `"${quote.content.substring(0, 60)}${quote.content.length > 60 ? '...' : ''}" - ${quote.author || 'Unknown'}`;
    const title = `${baseTitle} - ${APP_NAME}`;
    const description = `${quote.content} - ${quote.author || 'Unknown'}. Discover and share inspiring quotes on QuotesHub.`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const ogImage = url ? `${origin}/api/og-image/${quote.id}` : `/api/og-image/${quote.id}`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:site_name" content={APP_NAME} />
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
