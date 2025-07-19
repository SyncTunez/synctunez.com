import React from 'react';
import Image from 'next/image';
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
    /** Whether to show radio button selection indicators */
    showRadioButton?: boolean;
    /** Extra className for root div */
    className?: string;
    /** Extra className for image/icon container */
    imageClassName?: string;
    /** Extra className for title text */
    titleClassName?: string;
    /** Extra className for subtitle text */
    subtitleClassName?: string;
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
    showRadioButton = false,
    className,
    imageClassName,
    titleClassName,
    subtitleClassName,
}) => {
    return (
        <div
            className={cn(
                'flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 rounded-none cursor-pointer transition-colors',
                selected ? 'bg-muted/30' : 'hover:bg-muted/30',
                className,
            )}
            onClick={onClick}
        >
            {/* Image or Default Icon */}
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={title}
                    width={40}
                    height={40}
                    loading="lazy"
                    className={cn("w-10 h-10 rounded-sm object-cover border", imageClassName)}
                />
            ) : (
                <div className={cn("w-10 h-10 rounded-sm border bg-muted flex items-center justify-center", imageClassName)}>
                    {defaultIcon}
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                <div className={cn("font-medium text-sm truncate", titleClassName)} title={title}>{title}</div>
                {subtitle && (
                    <div className={cn("text-xs text-muted-foreground truncate", subtitleClassName)} title={subtitle}>{subtitle}</div>
                )}
            </div>

            {rightElement ? (
                <div className="ml-2 sm:ml-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    {rightElement}
                </div>
            ) : showRadioButton ? (
                <div className="ml-2 sm:ml-4 flex-shrink-0">
                    {selected ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                    )}
                </div>
            ) : null}
        </div>
    );
}; 