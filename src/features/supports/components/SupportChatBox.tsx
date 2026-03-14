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
  ticketId: number;
  currentUserId: string;
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
}: SupportChatBoxProps) {
  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useSupportMessages(ticketId);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  const handleIncomingMessage = useCallback((incoming: SupportMessage) => {
    setChatMessages((prev) => {
      if (prev.some((msg) => msg.id === incoming.id)) return prev;
      return [...prev, incoming];
    });
  }, []);

  const { isConnected, sendMessageSocket } = useSupportSocket({
    ticketId,
    currentUserId,
    onMessage: handleIncomingMessage,
  });

  // Tự cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const optimisticMessage: SupportMessage = {
      id: -Date.now(),
      ticketId,
      senderId: currentUserId,
      senderRole: "CUSTOMER",
      message: trimmed,
      isRead: false,
      createdAt: new Date().toISOString(),
      ticket: "",
    };

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
    <div className="flex h-full flex-col">
      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {chatMessages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground pt-10">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </p>
        ) : (
          chatMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isMine={msg.senderId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input gửi tin nhắn */}
      <div className="border-t p-3 flex items-center gap-2 bg-background">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {!isConnected && (
        <p className="px-3 pb-2 text-xs text-muted-foreground">
          Đang kết nối realtime...
        </p>
      )}
    </div>
  );
}
