import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LoadingSpinner } from "@/shared/components/common";
import { cn } from "@/lib/utils";
import { useSendMessage, useSupportMessages } from "../hooks/useSupport";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useSupportMessages(ticketId);
  const { mutate: sendMessage, isPending } = useSendMessage(ticketId);

  // Tự cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    sendMessage(
      { ticketId, message: trimmed },
      { onSuccess: () => setText("") },
    );
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
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground pt-10">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </p>
        ) : (
          messages.map((msg) => (
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
          disabled={isPending}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!text.trim() || isPending}
        >
          {isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
