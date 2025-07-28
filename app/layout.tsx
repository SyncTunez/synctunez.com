import Providers from '@/components/layout/Providers';
import ClientToaster from '@/components/ClientToaster';
import {fontVariables} from '@/lib/font';
import ThemeProvider from '@/components/layout/theme-provider';
import {cn} from '@/lib/utils';
import type {Metadata, Viewport} from 'next';
import {cookies} from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';
import {Toaster} from "sonner";
import dynamic from 'next/dynamic';
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/app-sidebar";
import FloatingSidebarTrigger from "@/components/FloatingSidebarTrigger";
import PageContainer from '@/components/layout/page-container';
import Script from 'next/script';
import ClientRegisterModalWrapper from '@/components/layout/ClientRegisterModalWrapper';
import { captureComponentError, addBreadcrumb } from '@/lib/sentry';

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

        const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
        const userSession = cookieStore.get("UserSession")?.value ?? null;
        const userAccountRaw = cookieStore.get("UserAccount")?.value ?? null;

        addBreadcrumb('RootLayout initialized', 'layout', {
            hasActiveTheme: !!activeThemeValue,
            isScaled,
            defaultOpen,
            hasUserSession: !!userSession,
            hasUserAccountRaw: !!userAccountRaw
        });

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
                    <Providers activeThemeValue={activeThemeValue as string}>
                        <ClientToaster />
                        <SidebarProvider defaultOpen={defaultOpen}>
                            <div className="flex min-h-svh w-full">
                                <AppSidebar/>
                                <FloatingSidebarTrigger />
                                <main className="flex-1 w-full">
                                    <PageContainer>
                                        {children}
                                    </PageContainer>
                                </main>
                            </div>
                        </SidebarProvider>
                        <ClientRegisterModalWrapper userSession={userSession} userAccountRaw={userAccountRaw}/>
                    </Providers>
                </ThemeProvider>
            </NuqsAdapter>
            </body>
            </html>
        );
    } catch (error) {
        captureComponentError(
            `RootLayout initialization failed: ${error instanceof Error ? error.message : String(error)}`,
            {
                component: 'RootLayout',
                action: 'initialize',
                additionalData: {
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                }
            },
            'error'
        );

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