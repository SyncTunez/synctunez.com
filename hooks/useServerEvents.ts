import { useEffect, useRef, useCallback } from 'react';
import { useServerEvents as useServerEventsCore } from '@/lib/api/ServerEvents';
import { z } from 'zod';

interface UseServerEventsOptions {
  maxReconnectAttempts?: number;
  initialReconnectDelay?: number;
  maxReconnectDelay?: number;
  reconnectBackoffMultiplier?: number;
  heartbeatInterval?: number;
  connectionTimeout?: number;
  enabled?: boolean;
}

export function useServerEvents<T = any>(
  url: string | null,
  eventName: string | null,
  schema: z.ZodSchema<T>,
  onEvent: (data: T) => void,
  options: UseServerEventsOptions = {}
) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const isConnectingRef = useRef(false);
  const { enabled = true, ...serverEventsOptions } = options;

  const connect = useCallback(async () => {
    if (!url || !eventName || !enabled || isConnectingRef.current) {
      return;
    }

    try {
      isConnectingRef.current = true;
      eventSourceRef.current = await useServerEventsCore(
        url,
        eventName,
        schema,
        onEvent,
        serverEventsOptions
      );
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
    } finally {
      isConnectingRef.current = false;
    }
  }, [url, eventName, schema, onEvent, enabled, serverEventsOptions]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect when URL or eventName changes
  useEffect(() => {
    if (url && eventName && enabled) {
      disconnect();
      connect();
    }
  }, [url, eventName, enabled, connect, disconnect]);

  return {
    isConnected: eventSourceRef.current?.readyState === 1, // EventSource.OPEN
    disconnect,
    connect
  };
} 