

import { EventSourcePolyfill } from 'event-source-polyfill';
import { z } from 'zod';
import { getLocalApiUrl } from '@/lib/utils';
import { captureSSEError, addBreadcrumb } from '@/lib/sentry';

export async function useServerEvents<T = any>(
  url: string, 
  eventName: string, 
  schema: z.ZodSchema<T>, 
  onEvent: (data: T) => void
) {
  try {
    const eventSource = new EventSourcePolyfill(`${getLocalApiUrl()}/events/${eventName}`, {
      withCredentials: true
    });

    addBreadcrumb(`Creating SSE connection to ${eventName}`, 'sse', {
      eventName,
      url,
      timestamp: new Date().toISOString()
    });

    eventSource.onerror = (event: any) => {
      const error = event.error || new Error('EventSource error occurred');
      
      captureSSEError(error, {
        sseEventName: eventName,
        sseUrl: url,
        component: 'ServerEvents',
        action: 'connect',
        eventType: 'error',
        eventData: event
      });

      console.error('Event source error:', event);
    };

    eventSource.addEventListener(eventName, (event: any) => {
      try {
        const parsedData = schema.safeParse(JSON.parse(event.data));

        if (parsedData.success) {
          addBreadcrumb(`SSE event received successfully`, 'sse', {
            eventName,
            url,
            dataType: typeof parsedData.data,
            dataLength: Array.isArray(parsedData.data) ? parsedData.data.length : 1
          });

          onEvent(parsedData.data);
        } else {
          const validationError = new Error(`Schema validation failed for ${eventName}: ${parsedData.error?.message}`);
          
          captureSSEError(validationError, {
            sseEventName: eventName,
            sseUrl: url,
            component: 'ServerEvents',
            action: 'validate_data',
            eventType: 'validation_error',
            eventData: event.data
          });
        }
      } catch (parseError) {
        const error = parseError instanceof Error ? parseError : new Error(String(parseError));
        
        captureSSEError(error, {
          sseEventName: eventName,
          sseUrl: url,
          component: 'ServerEvents',
          action: 'parse_data',
          eventType: 'parse_error',
          eventData: event.data
        });
      }
    });

    const response = await fetch(url);

    if (response.status !== 200) {
      const apiError = new Error(`Failed to connect to SSE: ${response.status} ${response.statusText}`);
      
      captureSSEError(apiError, {
        sseEventName: eventName,
        sseUrl: url,
        component: 'ServerEvents',
        action: 'initiate_stream',
        statusCode: response.status,
        responseData: await response.text().catch(() => 'Unable to read response body')
      });

      console.error("Failed to connect to SSE:", response);
    }

    addBreadcrumb(`SSE connection established successfully`, 'sse', {
      eventName,
      url,
      readyState: eventSource.readyState
    });

    return eventSource;
  } catch (error) {
    const finalError = error instanceof Error ? error : new Error(String(error));
    
    captureSSEError(finalError, {
      sseEventName: eventName,
      sseUrl: url,
      component: 'ServerEvents',
      action: 'establish_connection'
    });

    throw finalError;
  }
}

