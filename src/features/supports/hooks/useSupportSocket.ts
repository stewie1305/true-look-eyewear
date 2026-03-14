import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { env } from "@/lib/env";
import type { SupportMessage } from "../types";

const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN: "support:join",
  LEAVE: "support:leave",
  SEND: "support:send-message",
  NEW_MESSAGE: "support:new-message",
  MESSAGES: "support:messages",
  ERROR: "support:error",
} as const;

interface UseSupportSocketProps {
  ticketId: number;
  currentUserId: string;
  onMessage?: (message: SupportMessage) => void;
}

function isSupportMessage(value: unknown): value is SupportMessage {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<SupportMessage>;
  return (
    typeof candidate.ticketId === "number" &&
    typeof candidate.message === "string" &&
    typeof candidate.senderId === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function normalizeMessages(payload: unknown): SupportMessage[] {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown[] })?.data)
      ? (payload as { data: unknown[] }).data
      : [payload];

  return raw.filter(isSupportMessage);
}

export function useSupportSocket({
  ticketId,
  currentUserId,
  onMessage,
}: UseSupportSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef<typeof onMessage>(onMessage);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!ticketId || !currentUserId) return;

    const socket = io(env.API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN, { ticketId, userId: currentUserId });
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload: unknown) => {
      const messages = normalizeMessages(payload);
      messages.forEach((msg) => {
        if (msg.ticketId === ticketId) {
          onMessageRef.current?.(msg);
        }
      });
    });

    socket.on(SOCKET_EVENTS.MESSAGES, (payload: unknown) => {
      const messages = normalizeMessages(payload);
      messages.forEach((msg) => {
        if (msg.ticketId === ticketId) {
          onMessageRef.current?.(msg);
        }
      });
    });

    socket.on(SOCKET_EVENTS.ERROR, () => {
      // giữ im lặng để tránh spam toast khi server chưa bật channel
    });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE, { ticketId, userId: currentUserId });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [ticketId, currentUserId]);

  const sendMessageSocket = useCallback(
    (message: string): boolean => {
      if (!message.trim()) return false;

      const socket = socketRef.current;
      if (!socket || !socket.connected) return false;

      socket.emit(SOCKET_EVENTS.SEND, {
        ticketId,
        senderId: currentUserId,
        message: message.trim(),
      });

      return true;
    },
    [ticketId, currentUserId],
  );

  return {
    isConnected,
    sendMessageSocket,
  };
}
