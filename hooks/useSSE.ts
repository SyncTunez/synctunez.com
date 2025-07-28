import { useEffect, useRef } from 'react';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { captureSSEError, addBreadcrumb } from '@/lib/sentry';

export function useSSE<T = any>(
  url: string,
  eventName: string | null,
  onEvent: (data: T, event: MessageEvent) => void,
  options?: { reconnectIntervalMs?: number }
) {

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Do not attempt to connect if no url was provided
    if (!url) {
      addBreadcrumb('SSE connection skipped', 'sse', { reason: 'no_url_provided' });
      return;
    }

    let isMounted = true;
    
    function connect() {
      if (!isMounted) return;
      
      addBreadcrumb('SSE connection attempt', 'sse', { 
        url, 
        eventName, 
        reconnectAttempt: reconnectAttemptsRef.current 
      });

      try {
        const eventSource = new EventSourcePolyfill(url, {
          withCredentials: true
        });
        eventSourceRef.current = eventSource;

        // Connection opened
        eventSource.onopen = () => {
          addBreadcrumb('SSE connection opened', 'sse', { 
            url, 
            eventName, 
            readyState: eventSource.readyState 
          });
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        };

        const handler = (event: MessageEvent) => {
          try {
            addBreadcrumb('SSE message received', 'sse', {
              url,
              eventName,
              eventType: event.type,
              lastEventId: (event as any).lastEventId,
              dataLength: event.data?.length || 0
            });

            const data = JSON.parse(event.data);
            onEvent(data, event);
          } catch (e) {
            // If not JSON, pass as string
            addBreadcrumb('SSE JSON parse failed, using raw data', 'sse', {
              url,
              eventName,
              eventType: event.type,
              error: e instanceof Error ? e.message : String(e),
              rawData: event.data
            });
            
            captureSSEError(
              `Failed to parse SSE JSON data: ${e instanceof Error ? e.message : String(e)}`,
              {
                sseEventName: eventName || 'default',
                sseUrl: url,
                eventType: event.type,
                lastEventId: (event as any).lastEventId,
                eventData: event.data,
                reconnectAttempts: reconnectAttemptsRef.current,
                eventSourceState: eventSource.readyState,
                additionalData: {
                  rawData: event.data,
                  parseError: e instanceof Error ? e.message : String(e)
                }
              },
              'warning'
            );
            
            onEvent(event.data as any, event);
          }
        };

        if (eventName) {
          // Cast to any to satisfy EventSource typings for custom event names
          eventSource.addEventListener(eventName as any, handler as any);
        } else {
          eventSource.onmessage = handler as any;
        }

        eventSource.onerror = (err) => {
          const errorContext = {
            sseEventName: eventName || 'default',
            sseUrl: url,
            reconnectAttempts: reconnectAttemptsRef.current,
            eventSourceState: eventSource.readyState,
            additionalData: {
              error: err,
              readyState: eventSource.readyState,
              url: eventSource.url
            }
          };

          addBreadcrumb('SSE connection error', 'sse', {
            url,
            eventName,
            readyState: eventSource.readyState,
            reconnectAttempt: reconnectAttemptsRef.current
          });

          if (eventSource.readyState === 2) {
            // Closed
            captureSSEError(
              `SSE connection closed unexpectedly`,
              errorContext,
              'error'
            );

            if (isMounted && options?.reconnectIntervalMs && reconnectAttemptsRef.current < maxReconnectAttempts) {
              reconnectAttemptsRef.current++;
              
              addBreadcrumb('SSE reconnection scheduled', 'sse', {
                url,
                eventName,
                reconnectAttempt: reconnectAttemptsRef.current,
                delay: options.reconnectIntervalMs
              });

              reconnectTimeoutRef.current = setTimeout(() => {
                if (isMounted) {
                  connect();
                }
              }, options.reconnectIntervalMs);
            } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
              captureSSEError(
                `SSE connection failed after ${maxReconnectAttempts} reconnection attempts`,
                {
                  ...errorContext,
                  reconnectAttempts: reconnectAttemptsRef.current
                },
                'error'
              );
            }
          } else {
            // Other error states
            captureSSEError(
              `SSE connection error: readyState ${eventSource.readyState}`,
              errorContext,
              'error'
            );
          }
        };
      } catch (error) {
        captureSSEError(
          `Failed to create SSE connection: ${error instanceof Error ? error.message : String(error)}`,
          {
            sseEventName: eventName || 'default',
            sseUrl: url,
            reconnectAttempts: reconnectAttemptsRef.current,
            additionalData: {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }
          },
          'error'
        );
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        addBreadcrumb('SSE connection cleanup', 'sse', { url, eventName });
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, eventName]);
} 