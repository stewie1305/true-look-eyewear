import { useMemo, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

import { productService } from "@/features/products/services";
import type { ProductVariant } from "@/features/products/types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  recommendations?: ProductVariant[];
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

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function parseBudget(input: string) {
  const normalized = normalize(input);
  const match = normalized.match(
    /(\d+[\d.,]*)\s*(trieu|tr|m|k|nghin|ngan|vnd|d)?/,
  );

  if (!match) return null;

  const raw = Number(match[1].replace(/[.,]/g, ""));
  if (Number.isNaN(raw)) return null;

  const unit = match[2] ?? "";
  if (["trieu", "tr", "m"].includes(unit)) return raw * 1_000_000;
  if (["k", "nghin", "ngan"].includes(unit)) return raw * 1_000;

  if (raw < 1000) return raw * 1_000_000;
  return raw;
}

function getSearchableText(item: ProductVariant) {
  const product = item.product;
  return normalize(
    [
      item.name,
      item.color,
      item.description,
      product.name,
      product.description,
      product.product_type,
      product.brand?.name,
      ...product.categories.map((c) => c.name),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function suggestProducts(query: string, products: ProductVariant[]) {
  if (!products.length) {
    return {
      text: "Hiện chưa có dữ liệu sản phẩm để gợi ý. Bạn thử lại sau nhé.",
      recommendations: [] as ProductVariant[],
    };
  }

  const q = normalize(query);
  const budget = parseBudget(query);

  const ranked = products
    .map((item) => {
      const searchable = getSearchableText(item);
      let score = 0;

      if (q.includes("kinh ram") || q.includes("sunglass")) {
        if (searchable.includes("sun") || searchable.includes("ram"))
          score += 4;
      }

      if (
        q.includes("kinh can") ||
        q.includes("can") ||
        q.includes("blue light") ||
        q.includes("di lam")
      ) {
        if (
          searchable.includes("rx") ||
          searchable.includes("frame") ||
          searchable.includes("optical")
        ) {
          score += 3;
        }
      }

      if (q.includes("tron") || q.includes("round")) {
        if (
          searchable.includes("square") ||
          searchable.includes("chu nhat") ||
          searchable.includes("cat eye")
        ) {
          score += 2;
        }
      }

      if (q.includes("vuong") || q.includes("square")) {
        if (searchable.includes("oval") || searchable.includes("round")) {
          score += 2;
        }
      }

      if (q.includes("toi gian") || q.includes("minimal")) {
        if (
          searchable.includes("minimal") ||
          searchable.includes("classic") ||
          searchable.includes("basic")
        ) {
          score += 2;
        }
      }

      if (q.includes("nhe") || q.includes("lightweight")) {
        if (
          searchable.includes("titanium") ||
          searchable.includes("light") ||
          searchable.includes("ultralight")
        ) {
          score += 2;
        }
      }

      const colorTokens = [
        "den",
        "bac",
        "vang",
        "xam",
        "nau",
        "trong",
        "black",
        "silver",
        "gold",
        "brown",
        "gray",
      ];
      for (const token of colorTokens) {
        if (q.includes(token) && searchable.includes(token)) score += 2;
      }

      const price = Number(item.price) || 0;
      if (budget) {
        if (price <= budget) score += 3;
        else score -= 1;
      }

      if (item.quantity > 0) score += 1;

      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  const recommendations = ranked.slice(0, 3);
  const budgetText = budget ? ` trong tầm ${CURRENCY.format(budget)}` : "";

  return {
    text: `Mình đã chọn ${recommendations.length} mẫu phù hợp${budgetText}. Bạn xem nhanh bên dưới nha 👇`,
    recommendations,
  };
}

export default function EyewearChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Xin chào 👋 Mình là trợ lý gợi ý kính. Bạn mô tả nhu cầu (gương mặt, phong cách, màu sắc, ngân sách), mình sẽ chọn mẫu phù hợp.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chatbox-product-suggestions"],
    queryFn: async () => {
      const response = await productService.getAll({
        page: 1,
        limit: 60,
        status: "active",
      });

      return Array.isArray(response) ? response : (response?.data ?? []);
    },
  });

  const products = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
      },
    ]);

    const result = suggestProducts(trimmed, products);

    setMessages((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        role: "bot",
        text: result.text,
        recommendations: result.recommendations,
      },
    ]);

    setInput("");
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
                  {message.text}
                </div>

                {message.recommendations &&
                  message.recommendations.length > 0 && (
                    <div className="space-y-2">
                      {message.recommendations.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-md border border-border bg-card p-2"
                        >
                          <p className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.product?.brand?.name} • {item.color}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-primary">
                              {CURRENCY.format(Number(item.price) || 0)}
                            </span>
                            <span className="text-muted-foreground">
                              Kho: {item.quantity}
                            </span>
                          </div>

                          <Button
                            asChild
                            size="xs"
                            variant="outline"
                            className="mt-2 w-full"
                          >
                            <Link
                              to={`/products/${item.id}`}
                              onClick={() => setIsOpen(false)}
                            >
                              Xem chi tiết sản phẩm
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <p className="text-xs text-muted-foreground">
                Đang tải danh sách sản phẩm...
              </p>
            )}
          </div>

          <div className="space-y-2 border-t border-border p-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.slice(0, 2).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
                  onClick={() => sendMessage(prompt)}
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
                  if (e.key === "Enter") sendMessage(input);
                }}
                placeholder="Ví dụ: Mình cần kính râm màu đen dưới 2tr"
              />
              <Button
                type="button"
                size="icon-sm"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
