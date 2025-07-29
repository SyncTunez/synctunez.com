import {fontVariables} from '@/lib/font';
import ThemeProvider from '@/components/layout/theme-provider';
import {cn} from '@/lib/utils';
import type {Metadata, Viewport} from 'next';
import {cookies} from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';
import Script from 'next/script';

const META_THEME_COLORS = {
    light: '#ffffff',
    dark: '#09090b'
};

export const metadata: Metadata = {
    title: {
        default: 'SyncTuneZ - Create Perfect Collaborative Playlists with Friends',
        template: '%s | SyncTuneZ'
    },
    description: 'Compare playlists with friends and create collaborative mixes of all your shared favorites. Stop skipping songs, start syncing music with SyncTuneZ.',
    keywords: ['playlist collaboration', 'music sharing', 'spotify playlist', 'music discovery', 'collaborative playlists', 'music sync', 'shared playlists'],
    authors: [{ name: 'SyncTuneZ Team' }],
    creator: 'SyncTuneZ',
    publisher: 'SyncTuneZ',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://synctunez.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://synctunez.com',
        title: 'SyncTuneZ - Create Perfect Collaborative Playlists with Friends',
        description: 'Compare playlists with friends and create collaborative mixes of all your shared favorites. Stop skipping songs, start syncing music.',
        siteName: 'SyncTuneZ',
        images: [
            {
                url: '/icon.svg',
                width: 1200,
                height: 630,
                alt: 'SyncTuneZ - Collaborative Playlist Creation',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SyncTuneZ - Create Perfect Collaborative Playlists with Friends',
        description: 'Compare playlists with friends and create collaborative mixes of all your shared favorites.',
        images: ['/icon.svg'],
        creator: '@synctunez',
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
    verification: {
        google: 'your-google-verification-code',
    },
};

export const viewport: Viewport = {
    themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    try {
        const cookieStore = await cookies();
        const activeThemeValue = cookieStore.get('active_theme')?.value;
        const isScaled = activeThemeValue?.endsWith('-scaled');

        return (
            <html lang='en' suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                  try {
                    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                    }
                  } catch (_) {}
                `
                    }}
                />
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "SyncTuneZ",
                            "description": "Create collaborative playlists with friends by comparing and syncing your music preferences",
                            "url": "https://synctunez.com",
                            "applicationCategory": "MusicApplication",
                            "operatingSystem": "Web Browser",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "featureList": [
                                "Playlist comparison",
                                "Collaborative playlist creation",
                                "Spotify integration",
                                "Music discovery",
                                "Friend sharing"
                            ],
                            "creator": {
                                "@type": "Organization",
                                "name": "SyncTuneZ"
                            }
                        })
                    }}
                />
                {/* Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}');
                    `}
                </Script>
            </head>
            <body
                className={cn(
                    'bg-background font-sans antialiased',
                    activeThemeValue ? `theme-${activeThemeValue}` : '',
                    isScaled ? 'theme-scaled' : '',
                    fontVariables
                )}
            >
                <NextTopLoader showSpinner={false}/>
                <NuqsAdapter>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme
                    >
                        <div className="min-h-screen">
                            {children}
                        </div>
                    </ThemeProvider>
                </NuqsAdapter>
            </body>
            </html>
        );
    } catch (error) {
        // Fallback layout in case of error
        return (
            <html lang='en'>
            <body className='bg-background font-sans antialiased'>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground">Please refresh the page to try again.</p>
                    </div>
                </div>
            </body>
            </html>
        );
    }
}