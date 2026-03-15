import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LoadingSpinner } from "@/shared/components/common";
import { cn } from "@/lib/utils";
import { useSupportMessages } from "../hooks/useSupport";
import { useSupportSocket } from "../hooks/useSupportSocket";
import type { SupportMessage } from "../types";

interface SupportChatBoxProps {
  ticketId: string | number;
  currentUserId: string | number;
  initialMessages?: SupportMessage[];
}

function getMessageKey(msg: SupportMessage): string {
  if (msg.id !== undefined && msg.id !== null && String(msg.id).trim()) {
    return `id:${String(msg.id)}`;
  }
  return [
    String(msg.ticketId ?? ""),
    msg.senderId ?? "",
    msg.createdAt ?? "",
    msg.message ?? "",
  ].join("|");
}

function isOptimisticMessage(msg: SupportMessage): boolean {
  return String(msg.id).startsWith("local-");
}

function isSameLogicalMessage(a: SupportMessage, b: SupportMessage): boolean {
  if (String(a.ticketId) !== String(b.ticketId)) return false;
  if (String(a.senderId) !== String(b.senderId)) return false;
  if (a.message.trim() !== b.message.trim()) return false;

  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();
  if (!Number.isFinite(aTime) || !Number.isFinite(bTime)) return true;

  return Math.abs(aTime - bTime) <= 15_000;
}

function mergeMessages(
  current: SupportMessage[],
  incoming: SupportMessage[],
): SupportMessage[] {
  if (incoming.length === 0) return current;

  const map = new Map<string, SupportMessage>();
  [...current, ...incoming].forEach((msg) => {
    if (!isOptimisticMessage(msg)) {
      for (const [key, existing] of map.entries()) {
        if (
          isOptimisticMessage(existing) &&
          isSameLogicalMessage(existing, msg)
        ) {
          map.delete(key);
        }
      }
    }

    if (isOptimisticMessage(msg)) {
      const alreadyConfirmed = Array.from(map.values()).some(
        (existing) =>
          !isOptimisticMessage(existing) && isSameLogicalMessage(existing, msg),
      );

      if (alreadyConfirmed) return;
    }

    map.set(getMessageKey(msg), msg);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function areMessagesEqual(a: SupportMessage[], b: SupportMessage[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];

    if (getMessageKey(left) !== getMessageKey(right)) return false;
    if (left.message !== right.message) return false;
    if (left.createdAt !== right.createdAt) return false;
    if (String(left.senderId) !== String(right.senderId)) return false;
  }

  return true;
}

function MessageBubble({
  msg,
  isMine,
}: {
  msg: SupportMessage;
  isMine: boolean;
}) {
  return (
    <div
      className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          isMine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        {!isMine && (
          <p className="mb-1 text-xs font-semibold text-muted-foreground">
            {msg.senderRole}
          </p>
        )}
        <p className="whitespace-pre-wrap wrap-break-word">{msg.message}</p>
        <p
          className={cn(
            "mt-1 text-right text-[10px]",
            isMine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default function SupportChatBox({
  ticketId,
  currentUserId,
  initialMessages = [],
}: SupportChatBoxProps) {
  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] =
    useState<SupportMessage[]>(initialMessages);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const hasInitializedScrollRef = useRef(false);
  const lastNewestMessageKeyRef = useRef<string>("");

  const { data: messages = [], isLoading } = useSupportMessages(ticketId);

  const isAdminSupportPage =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin/support");

  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages((prev) => {
        const merged = mergeMessages(prev, messages);
        return areMessagesEqual(prev, merged) ? prev : merged;
      });
      return;
    }

    if (initialMessages.length > 0) {
      setChatMessages((prev) => {
        const merged = mergeMessages(prev, initialMessages);
        return areMessagesEqual(prev, merged) ? prev : merged;
      });
    }
  }, [messages, initialMessages]);

  const handleIncomingMessage = useCallback((incoming: SupportMessage) => {
    setChatMessages((prev) => {
      const merged = mergeMessages(prev, [incoming]);
      return areMessagesEqual(prev, merged) ? prev : merged;
    });
  }, []);

  const { isConnected, sendMessageSocket } = useSupportSocket({
    ticketId,
    currentUserId,
    onMessage: handleIncomingMessage,
  });

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - (el.scrollTop + el.clientHeight);
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  }, []);

  // Chỉ auto-scroll khi người dùng đang ở gần cuối khung chat
  useEffect(() => {
    const newest = chatMessages[chatMessages.length - 1];
    const newestKey = newest ? getMessageKey(newest) : "";

    if (!hasInitializedScrollRef.current) {
      lastNewestMessageKeyRef.current = newestKey;
      scrollToBottom("auto");
      hasInitializedScrollRef.current = true;
      return;
    }

    if (newestKey === lastNewestMessageKeyRef.current) {
      return;
    }

    lastNewestMessageKeyRef.current = newestKey;

    if (shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [chatMessages, scrollToBottom]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const optimisticMessage: SupportMessage = {
      id: `local-${Date.now()}`,
      ticketId,
      senderId: String(currentUserId),
      senderRole: isAdminSupportPage ? "staff" : "customer",
      message: trimmed,
      isRead: false,
      createdAt: new Date().toISOString(),
      ticket: "",
    };

    shouldAutoScrollRef.current = true;
    setChatMessages((prev) => [...prev, optimisticMessage]);
    setText("");

    const sent = sendMessageSocket(trimmed);
    if (!sent) {
      setChatMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id),
      );
      toast.error("Mất kết nối chat realtime. Vui lòng thử lại.");
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="py-10" />;
  }

  return (
    <div className="flex h-full flex-col bg-linear-to-b from-background to-muted/20">
      {/* Danh sách tin nhắn */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto p-4 pr-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.45)_transparent]"
      >
        {chatMessages.length === 0 ? (
          <div className="pt-10">
            <p className="rounded-lg border border-dashed border-border/70 bg-card/60 px-4 py-6 text-center text-sm text-muted-foreground backdrop-blur-sm">
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <MessageBubble
              key={getMessageKey(msg)}
              msg={msg}
              isMine={String(msg.senderId) === String(currentUserId)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input gửi tin nhắn */}
      <div className="border-t border-border/60 bg-background/90 p-3 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-1.5">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="h-9 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim()}
            className="h-9 w-9 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isConnected && (
        <p className="px-3 pb-2 text-xs text-muted-foreground">
          Đang kết nối realtime...
        </p>
      )}
    </div>
  );
}
