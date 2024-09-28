import { Metadata } from 'next'

interface IMetadata {
    pageTitle: string;
    description: string;
    canonicalPath: string;
    type?: 'website' | 'article';
    keywords?: string[];
}

export function useGenerateMetadata({
    pageTitle,
    description,
    canonicalPath,
    type = 'website',
    keywords = [],
}: IMetadata): Metadata {
    
    const siteTitle = 'Ahmad Faiz';
    const fullTitle = `${pageTitle} | ${siteTitle}`;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: [{
            name: "Ahmad Faiz's Portofolio",
            url: 'https://ahmad-faiz.com'
        }],
        openGraph: {
            title: fullTitle,
            description,
            url: `https://ahmad-faiz.com${canonicalPath}`,
            siteName: siteTitle,
            locale: 'en_US',
            alternateLocale: 'id_ID',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
        },
        alternates: {
            canonical: `https://ahmad-faiz.com${canonicalPath}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    }
}