

import { EventSourcePolyfill } from 'event-source-polyfill';
import { z } from 'zod';

export async function useServerEvents<T = any>(url: string, eventName: string, shema: z.ZodSchema<T>, onEvent: (data: T) => void) {

    const eventSource = new EventSourcePolyfill('http://localhost:8080/events/'+eventName, {
        withCredentials: true
    });

    eventSource.onerror = (event: any) => {
        console.log("Error:", event);
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

