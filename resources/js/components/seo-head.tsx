import { Head } from '@inertiajs/react';

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

type Props = {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    keywords?: string;
    noindex?: boolean;
    structuredData?: StructuredData;
};

const defaultImage =
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80';

export default function SeoHead({
    title,
    description,
    path = '/',
    image = defaultImage,
    type = 'website',
    keywords = 'hotel booking, luxury hotel, room booking, online reservation, AetherStay',
    noindex = false,
    structuredData,
}: Props) {
    const appName = import.meta.env.VITE_APP_NAME || 'AetherStay';
    const appUrl = (import.meta.env.VITE_APP_URL || '').replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const canonical = appUrl ? `${appUrl}${normalizedPath}` : undefined;
    const ogTitle = `${title} | ${appName}`;
    const structuredDataJson = structuredData ? JSON.stringify(structuredData) : null;

    return (
        <Head title={title}>
            <meta head-key="description" name="description" content={description} />
            <meta head-key="keywords" name="keywords" content={keywords} />
            <meta head-key="robots" name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />

            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:title" property="og:title" content={ogTitle} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:image" property="og:image" content={image} />
            {canonical && <meta head-key="og:url" property="og:url" content={canonical} />}
            <meta head-key="og:site_name" property="og:site_name" content={appName} />

            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={ogTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />
            <meta head-key="twitter:image" name="twitter:image" content={image} />

            {canonical && <link head-key="canonical" rel="canonical" href={canonical} />}

            {structuredDataJson && (
                <script
                    head-key="structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: structuredDataJson }}
                />
            )}
        </Head>
    );
}
