import React, { useState } from 'react';
import { useSSE } from './useSSE';
import {authorized} from "@/lib/api/apiClient";

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
}: UseLiveResourceOptions<T>) {
  const [data, setData] = useState<T | RawSSEEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(fetchUrl)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          setError(errorMsg);
          setLoading(false);
          if (onFail) onFail(errorMsg);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetchUrl, onFail]);

  useSSE<any>(
    'http://localhost:8080/spotify/queue/events',
    eventName,
    (newData, event) => {
      if (responseType === 'raw') {
        // Try to extract id/event/data from the event
        let raw: RawSSEEvent = {
          id: (event as any).lastEventId,
          event: event.type,
          data: undefined,
        };
        try {
          raw.data = typeof newData === 'string' ? JSON.parse(newData) : newData;
        } catch {
          raw.data = newData;
        }
        setData(raw);
        if (onMessage) onMessage(raw as any, event);
      } else {
        setData(newData);
        if (onMessage) onMessage(newData, event);
      }
    },
    { reconnectIntervalMs }
  );

  return { data, loading, error };
} 