import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store";
import type { SupportMessage } from "../types";

const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN: "join_ticket",
  JOIN_FALLBACK: "support:join",
  LEAVE: "leave_ticket",
  LEAVE_FALLBACK: "support:leave",
  SEND: "send_message",
  SEND_FALLBACK: "support:send-message",
  NEW_MESSAGE: "receive_message",
  NEW_MESSAGE_FALLBACK: "support:new-message",
  MESSAGES: "support:messages",
  ERROR: "support:error",
} as const;

interface UseSupportSocketProps {
  ticketId: string | number;
  currentUserId: string | number;
  onMessage?: (message: SupportMessage) => void;
}

function isSupportMessage(value: unknown): value is SupportMessage {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<SupportMessage>;
  return (
    (typeof candidate.ticketId === "string" ||
      typeof candidate.ticketId === "number") &&
    typeof candidate.message === "string" &&
    typeof candidate.senderId === "string" &&
    typeof candidate.createdAt === "string"
  );
}

export function useSupportSocket({
  ticketId,
  currentUserId,
  onMessage,
}: UseSupportSocketProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef<typeof onMessage>(onMessage);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const normalizeMessages = useCallback(
    (payload: unknown): SupportMessage[] => {
      const source =
        typeof payload === "string"
          ? (() => {
              try {
                return JSON.parse(payload) as unknown;
              } catch {
                return payload;
              }
            })()
          : payload;

      const raw = Array.isArray(source)
        ? source
        : Array.isArray((source as { data?: unknown[] })?.data)
          ? (source as { data: unknown[] }).data
          : [source];

      return raw
        .map((item): SupportMessage | null => {
          if (isSupportMessage(item)) return item;

          if (typeof item === "string") {
            return {
              id: `socket-${Date.now()}`,
              ticketId,
              senderId: "",
              senderRole: "STAFF",
              message: item,
              isRead: false,
              createdAt: new Date().toISOString(),
            };
          }

          if (!item || typeof item !== "object") return null;

          const candidate = item as {
            id?: string | number;
            ticketId?: string | number;
            senderId?: string;
            senderRole?: string;
            message?: string;
            content?: string;
            isRead?: boolean;
            createdAt?: string;
          };

          const text =
            typeof candidate.message === "string"
              ? candidate.message
              : typeof candidate.content === "string"
                ? candidate.content
                : "";

          if (!text) return null;

          return {
            id: candidate.id ?? `socket-${Date.now()}`,
            ticketId: candidate.ticketId ?? ticketId,
            senderId: candidate.senderId ?? "",
            senderRole: candidate.senderRole ?? "STAFF",
            message: text,
            isRead: candidate.isRead ?? false,
            createdAt: candidate.createdAt ?? new Date().toISOString(),
          };
        })
        .filter((item): item is SupportMessage => Boolean(item));
    },
    [ticketId],
  );

  useEffect(() => {
    if (!ticketId || !currentUserId) return;

    const normalizedApiUrl = env.API_URL.endsWith("/")
      ? env.API_URL
      : `${env.API_URL}/`;
    const apiOrigin = new URL(normalizedApiUrl).origin;
    const namespaceUrl = `${apiOrigin}/support`;

    const socket = io(namespaceUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: accessToken
        ? {
            token: `Bearer ${accessToken}`,
          }
        : undefined,
    });
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN, Number(ticketId));
      socket.emit(SOCKET_EVENTS.JOIN_FALLBACK, {
        ticketId,
        userId: String(currentUserId),
      });
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload: unknown) => {
      const messages = normalizeMessages(payload);
      messages.forEach((msg) => {
        if (String(msg.ticketId) === String(ticketId)) {
          onMessageRef.current?.(msg);
        }
      });
    });

    socket.on(SOCKET_EVENTS.NEW_MESSAGE_FALLBACK, (payload: unknown) => {
      const messages = normalizeMessages(payload);
      messages.forEach((msg) => {
        if (String(msg.ticketId) === String(ticketId)) {
          onMessageRef.current?.(msg);
        }
      });
    });

    socket.on(SOCKET_EVENTS.MESSAGES, (payload: unknown) => {
      const messages = normalizeMessages(payload);
      messages.forEach((msg) => {
        if (String(msg.ticketId) === String(ticketId)) {
          onMessageRef.current?.(msg);
        }
      });
    });

    socket.on(SOCKET_EVENTS.ERROR, () => {
      // giữ im lặng để tránh spam toast khi server chưa bật channel
    });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE, ticketId);
      socket.emit(SOCKET_EVENTS.LEAVE_FALLBACK, {
        ticketId,
        userId: String(currentUserId),
      });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [ticketId, currentUserId, accessToken]);

  const sendMessageSocket = useCallback(
    (message: string): boolean => {
      if (!message.trim()) return false;

      const socket = socketRef.current;
      if (!socket || !socket.connected) return false;

      const payload = {
        ticketId: Number(ticketId),
        senderId: String(currentUserId),
        message: message.trim(),
        content: message.trim(),
      };

      socket.emit(SOCKET_EVENTS.SEND, payload);
      socket.emit(SOCKET_EVENTS.SEND_FALLBACK, payload);

      return true;
    },
    [ticketId, currentUserId],
  );

  return {
    isConnected,
    sendMessageSocket,
  };
}
