import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface UseStompOptions {
  endpoint: string;
  onMessage?: (destination: string, body: unknown) => void;
  subscriptions?: string[];
}

type ManagedSubscription = {
  destination: string;
  handler: (body: unknown) => void;
  stompSub?: StompSubscription;
};

const EMPTY_SUBSCRIPTIONS: string[] = [];

function parseMessageBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function attachSubscription(client: Client, entry: ManagedSubscription): void {
  entry.stompSub?.unsubscribe();
  entry.stompSub = client.subscribe(entry.destination, (message: IMessage) => {
    entry.handler(parseMessageBody(message.body));
  });
}

export function useStomp({
  endpoint,
  onMessage,
  subscriptions = EMPTY_SUBSCRIPTIONS,
}: UseStompOptions) {
  const clientRef = useRef<Client | null>(null);
  const connectGenerationRef = useRef(0);
  const managedSubsRef = useRef<ManagedSubscription[]>([]);
  const staticSubscriptionsRef = useRef(subscriptions);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  staticSubscriptionsRef.current = subscriptions;

  const applyManagedSubscriptions = useCallback((client: Client) => {
    managedSubsRef.current.forEach((entry) => attachSubscription(client, entry));
  }, []);

  const disconnect = useCallback(() => {
    connectGenerationRef.current += 1;
    managedSubsRef.current.forEach((entry) => {
      entry.stompSub?.unsubscribe();
      entry.stompSub = undefined;
    });
    clientRef.current?.deactivate();
    clientRef.current = null;
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    if (clientRef.current?.active) {
      return;
    }

    const generation = ++connectGenerationRef.current;

    const client = new Client({
      webSocketFactory: () => new SockJS(endpoint) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        if (generation !== connectGenerationRef.current) return;
        setIsConnected(true);
        staticSubscriptionsRef.current.forEach((dest) => {
          client.subscribe(dest, (message: IMessage) => {
            onMessageRef.current?.(dest, parseMessageBody(message.body));
          });
        });
        applyManagedSubscriptions(client);
      },
      onDisconnect: () => {
        if (generation !== connectGenerationRef.current) return;
        setIsConnected(false);
        managedSubsRef.current.forEach((entry) => {
          entry.stompSub = undefined;
        });
      },
      onStompError: () => {
        if (generation !== connectGenerationRef.current) return;
        setIsConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();
  }, [endpoint, applyManagedSubscriptions]);

  const publish = useCallback((destination: string, body: unknown) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  }, []);

  const subscribe = useCallback((destination: string, handler: (body: unknown) => void) => {
    const entry: ManagedSubscription = { destination, handler };
    managedSubsRef.current.push(entry);

    if (clientRef.current?.connected) {
      attachSubscription(clientRef.current, entry);
    }

    return {
      unsubscribe: () => {
        entry.stompSub?.unsubscribe();
        managedSubsRef.current = managedSubsRef.current.filter((item) => item !== entry);
      },
    };
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [endpoint, connect, disconnect]);

  return { isConnected, publish, subscribe, client: clientRef.current };
}

export function getWsBaseUrl(): string {
  const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
  return apiBase.replace(/\/$/, '');
}
