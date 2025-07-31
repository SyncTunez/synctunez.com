

import { EventSourcePolyfill } from 'event-source-polyfill';
import { z } from 'zod';
import { getLocalApiUrl } from '@/lib/utils';

export async function useServerEvents<T = any>(url: string, eventName: string, shema: z.ZodSchema<T>, onEvent: (data: T) => void) {

    const eventSource = new EventSourcePolyfill(`${getLocalApiUrl()}/events/${eventName}`, {
        withCredentials: true
    });

    eventSource.onerror = (event: any) => {
        console.error('Event source error:', event);
    }

    eventSource.addEventListener(eventName, (event: any) => {
        const parsedData = shema.safeParse(JSON.parse(event.data));

        if(parsedData?.success) {
            onEvent(parsedData.data);
        }
    });

    await fetch(url);

    return eventSource;
}

