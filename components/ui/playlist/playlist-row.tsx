import React from 'react';
import { cn } from '@/lib/utils';

export interface PlaylistRowProps {
    imageUrl?: string;
    /** Icon or fallback element to show when no imageUrl */
    defaultIcon: React.ReactNode;
    title: string;
    subtitle?: string;
    selected?: boolean;
    onClick?: () => void;
    /** Optional element rendered on the far right (e.g. import button). */
    rightElement?: React.ReactNode;
    /** Extra className for root div */
    className?: string;
}

/**
 * Simple reusable presentation component for playlist rows.
 */
export const PlaylistRow: React.FC<PlaylistRowProps> = ({
    imageUrl,
    defaultIcon,
    title,
    subtitle,
    selected = false,
    onClick,
    rightElement,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex items-center gap-2 p-2 rounded cursor-pointer transition-colors',
                selected ? 'bg-accent' : 'hover:bg-muted',
                className,
            )}
            onClick={onClick}
        >
            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-10 h-10 rounded object-cover border"
                />
            ) : (
                <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                    {defaultIcon}
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                <div className="font-medium text-sm truncate" title={title}>{title}</div>
                {subtitle && (
                    <div className="text-xs text-muted-foreground truncate" title={subtitle}>{subtitle}</div>
                )}
            </div>

            {rightElement && (
                <div className="ml-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    {rightElement}
                </div>
            )}
        </div>
    );
}; 