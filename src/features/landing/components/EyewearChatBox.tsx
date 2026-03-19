import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";

import { sendChatMessage, type ChatRecommendation } from "@/lib/coze";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  recommendations?: ChatRecommendation[];
  action?: string;
};

const QUICK_PROMPTS = [
  "Mình mặt tròn, muốn kính đi làm dưới 2 triệu",
  "Gợi ý kính râm màu đen cho nam",
  "Mình cần gọng nhẹ để đeo cả ngày",
  "Có mẫu nào phong cách tối giản không?",
];

const CURRENCY = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const CHATBOX_Z_INDEX = 2147483000;

export default function EyewearChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Xin chào 👋 Mình là trợ lý tư vấn kính True Look. Bạn cứ mô tả nhu cầu, mình sẽ gửi câu trả lời và mẫu phù hợp từ hệ thống AI.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const nextMessageId = (prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [
      ...prev,
      {
        id: nextMessageId("user"),
        role: "user",
        text: trimmed,
      },
    ]);

    setInput("");

    try {
      setIsSending(true);
      const response = await sendChatMessage(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId("bot"),
          role: "bot",
          text: response.reply,
          recommendations: response.products,
          action: response.action,
        },
      ]);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Không thể gửi tin nhắn tới trợ lý. Bạn thử lại sau nhé.";

      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId("bot-error"),
          role: "bot",
          text: fallbackMessage,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-6 left-6"
        style={{ zIndex: CHATBOX_Z_INDEX }}
      >
        <Button
          type="button"
          size="icon-lg"
          className="rounded-full shadow-xl"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Mở hộp chat tư vấn kính"
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <MessageCircle className="size-5" />
          )}
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed bottom-24 left-6 w-[92vw] max-w-sm rounded-xl border border-border bg-background shadow-2xl"
          style={{ zIndex: CHATBOX_Z_INDEX }}
        >
          <div className="flex items-center gap-2 border-b border-border p-3">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-medium">Trợ lý gợi ý kính True Look</p>
          </div>

          <div
            ref={containerRef}
            className="h-96 space-y-3 overflow-y-auto p-3"
          >
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>

                  {message.action && (
                    <div className="mt-2 inline-flex rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {message.action}
                    </div>
                  )}
                </div>

                {message.recommendations &&
                  message.recommendations.length > 0 && (
                    <div className="space-y-2">
                      {message.recommendations.map((item, index) => (
                        <div
                          key={item.id ?? `${item.name}-${index}`}
                          className="rounded-md border border-border bg-card p-2"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="mb-2 h-28 w-full rounded-md object-cover"
                            />
                          )}

                          <p className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {[item.brandName, item.color]
                              .filter(Boolean)
                              .join(" • ") || "Sản phẩm gợi ý"}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-primary">
                              {typeof item.price === "number"
                                ? CURRENCY.format(item.price)
                                : "Liên hệ"}
                            </span>
                            <span className="text-muted-foreground">
                              {typeof item.quantity === "number"
                                ? `Kho: ${item.quantity}`
                                : "Xem thêm chi tiết"}
                            </span>
                          </div>

                          {item.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {item.routeId ? (
                            <Button
                              asChild
                              size="xs"
                              variant="outline"
                              className="mt-2 w-full"
                            >
                              <Link
                                to={`/products/${item.routeId}`}
                                onClick={() => setIsOpen(false)}
                              >
                                Xem chi tiết sản phẩm
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isSending && (
              <div className="flex max-w-[85%] items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Trợ lý đang trả lời...</span>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-border p-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.slice(0, 2).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
                  onClick={() => {
                    void sendMessage(prompt);
                  }}
                  disabled={isSending}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ví dụ: Mình cần kính râm màu đen dưới 2tr"
                disabled={isSending}
              />
              <Button
                type="button"
                size="icon-sm"
                onClick={() => {
                  void sendMessage(input);
                }}
                disabled={!input.trim() || isSending}
              >
                {isSending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
