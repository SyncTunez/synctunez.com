import React, { useState } from 'react';
import { useSSE } from './useSSE';
import {authorized} from "@/lib/api/apiClient";
import { captureAPIError, captureSSEError, addBreadcrumb } from '@/lib/sentry';

export interface RawSSEEvent {
  id?: string;
  event?: string;
  data: any;
}

interface UseLiveResourceOptions<T = any> {
  fetchUrl: string;
  eventName: string | null;
  reconnectIntervalMs?: number;
  onFail?: (errorMessage: string) => void;
  onMessage?: (data: T, event: MessageEvent) => void;
  responseType?: 'json' | 'raw';
  /**
   * If false, the hook will skip the initial fetch and SSE subscription.
   * Useful when you always want to pass the same URLs but only sometimes
   * activate the live resource logic.
   */
  shouldProcess?: boolean;
  /**
   * Component name for error tracking
   */
  componentName?: string;
  /**
   * User ID for error tracking
   */
  userId?: string;
}

export function useLiveResourceJson<T>(options: Omit<Parameters<typeof useLiveResource<T>>[0], 'responseType'>) {
  return useLiveResource<T>({ ...options, responseType: 'json' });
}

export function useLiveResourceRaw(options: Omit<Parameters<typeof useLiveResource>[0], 'responseType'>) {
  return useLiveResource<RawSSEEvent>({ ...options, responseType: 'raw' });
}

export function useLiveResource<T = any>({
  fetchUrl,
  eventName,
  reconnectIntervalMs,
  onFail,
  onMessage,
  responseType = 'json',
  shouldProcess = true,
  componentName = 'useLiveResource',
  userId,
}: UseLiveResourceOptions<T>) {
  const [data, setData] = useState<T | RawSSEEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data (only if a fetchUrl is provided)
  React.useEffect(() => {
    if (!shouldProcess || !fetchUrl) {
      setLoading(false);
      addBreadcrumb('LiveResource fetch skipped', 'live-resource', { 
        reason: !shouldProcess ? 'shouldProcess=false' : 'no_fetchUrl',
        fetchUrl,
        componentName 
      });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    
    addBreadcrumb('LiveResource fetch started', 'live-resource', { 
      fetchUrl, 
      componentName,
      userId 
    });

    fetch(fetchUrl)
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = `Failed to fetch: ${res.status} ${res.statusText}`;
          
          captureAPIError(
            errorMessage,
            {
              endpoint: fetchUrl,
              method: 'GET',
              statusCode: res.status,
              component: componentName,
              userId,
              additionalData: {
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                url: res.url
              }
            },
            'error'
          );
          
          throw new Error(errorMessage);
        }
        
        addBreadcrumb('LiveResource fetch successful', 'live-resource', { 
          fetchUrl, 
          componentName,
          status: res.status 
        });
        
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          setError(errorMsg);
          setLoading(false);
          
          captureAPIError(
            `LiveResource fetch failed: ${errorMsg}`,
            {
              endpoint: fetchUrl,
              method: 'GET',
              statusCode: 0, // Network error
              component: componentName,
              userId,
              additionalData: {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
                cancelled
              }
            },
            'error'
          );
          
          if (onFail) onFail(errorMsg);
        }
      });

    return () => {
      cancelled = true;
      addBreadcrumb('LiveResource fetch cleanup', 'live-resource', { 
        fetchUrl, 
        componentName,
        cancelled 
      });
    };
  }, [fetchUrl, onFail, shouldProcess, componentName, userId]);

  // Construct SSE URL only when eventName is provided
  const eventUrl = shouldProcess && eventName ? `http://localhost:8080/events/${eventName}` : '';

  useSSE<any>(
    eventUrl,
    shouldProcess ? eventName : null,
    (newData, event) => {
      try {
        addBreadcrumb('LiveResource SSE message received', 'live-resource', {
          eventUrl,
          eventName,
          componentName,
          userId,
          eventType: event.type,
          dataType: typeof newData
        });

        if (responseType === 'raw') {
          // Try to extract id/event/data from the event
          let raw: RawSSEEvent = {
            id: (event as any).lastEventId,
            event: event.type,
            data: undefined,
          };
          try {
            raw.data = typeof newData === 'string' ? JSON.parse(newData) : newData;
          } catch (parseError) {
            captureSSEError(
              `Failed to parse SSE data in LiveResource: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
              {
                sseEventName: eventName || 'default',
                sseUrl: eventUrl,
                eventType: event.type,
                lastEventId: (event as any).lastEventId,
                eventData: newData,
                component: componentName,
                userId,
                additionalData: {
                  rawData: newData,
                  parseError: parseError instanceof Error ? parseError.message : String(parseError),
                  responseType
                }
              },
              'warning'
            );
            raw.data = newData;
          }
          setData(raw);
          if (onMessage) onMessage(raw as any, event);
        } else {
          setData(newData);
          if (onMessage) onMessage(newData, event);
        }
      } catch (error) {
        captureSSEError(
          `LiveResource SSE message processing failed: ${error instanceof Error ? error.message : String(error)}`,
          {
            sseEventName: eventName || 'default',
            sseUrl: eventUrl,
            eventType: event.type,
            lastEventId: (event as any).lastEventId,
            eventData: newData,
            component: componentName,
            userId,
            additionalData: {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              responseType,
              newData
            }
          },
          'error'
        );
      }
    },
    { reconnectIntervalMs }
  );

  return { data, loading, error };
} 