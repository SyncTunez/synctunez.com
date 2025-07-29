'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console for debugging
        console.error('Global error caught:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground mb-4">
                            An unexpected error occurred. Please try again.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={() => reset()} 
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Try again
                            </button>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}