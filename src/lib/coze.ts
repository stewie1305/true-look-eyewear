import type { ProductVariant } from "@/features/products/types";
import { API_ENDPOINTS } from "@/shared/constants";
import { env } from "./env";

type UnknownRecord = Record<string, unknown>;

export interface ChatRecommendation {
  id?: string;
  routeId?: string;
  name: string;
  price?: number;
  color?: string;
  quantity?: number;
  description?: string;
  brandName?: string;
  image?: string;
}

export interface ChatResponse {
  reply: string;
  products: ChatRecommendation[];
  action?: string;
  logs: string[];
  gpu?: UnknownRecord;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
}

function pickNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function getImagePath(
  rawProduct: UnknownRecord,
  nestedProduct?: UnknownRecord,
) {
  const imageCandidates = [
    rawProduct.image,
    rawProduct.thumbnail,
    rawProduct.imageUrl,
    rawProduct.image_url,
    nestedProduct?.image,
    nestedProduct?.thumbnail,
    nestedProduct?.imageUrl,
    nestedProduct?.image_url,
  ];

  const directMatch = pickString(...imageCandidates);
  if (directMatch) {
    return directMatch;
  }

  const listCandidates = [rawProduct.images, nestedProduct?.images];
  for (const candidate of listCandidates) {
    if (!Array.isArray(candidate) || candidate.length === 0) continue;

    const firstItem = candidate[0];
    if (typeof firstItem === "string" && firstItem.trim()) {
      return firstItem;
    }

    if (isRecord(firstItem)) {
      const path = pickString(
        firstItem.path,
        firstItem.url,
        firstItem.image,
        firstItem.imageUrl,
        firstItem.image_url,
      );
      if (path) {
        return path;
      }
    }
  }

  return undefined;
}

function normalizeRecommendation(payload: unknown): ChatRecommendation | null {
  if (!isRecord(payload)) {
    return null;
  }

  const nestedProduct = isRecord(payload.product) ? payload.product : undefined;
  const nestedBrand =
    nestedProduct && isRecord(nestedProduct.brand)
      ? nestedProduct.brand
      : isRecord(payload.brand)
        ? payload.brand
        : undefined;

  const routeId = pickString(
    payload.id,
    payload.variant_id,
    payload.product_variant_id,
  );

  const name = pickString(payload.name, nestedProduct?.name, payload.title);
  if (!name) {
    return null;
  }

  return {
    id: pickString(payload.id, payload.product_id, routeId, name),
    routeId,
    name,
    price: pickNumber(payload.price, payload.sale_price, nestedProduct?.price),
    color: pickString(payload.color, payload.variant_color),
    quantity: pickNumber(payload.quantity, payload.stock, payload.inventory),
    description: pickString(payload.description, nestedProduct?.description),
    brandName: pickString(nestedBrand?.name, payload.brand_name),
    image: getImagePath(payload, nestedProduct),
  };
}

function normalizeProducts(products: unknown): ChatRecommendation[] {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map(normalizeRecommendation)
    .filter((item): item is ChatRecommendation => item !== null);
}

function normalizeResponse(payload: unknown): ChatResponse {
  const fallback: ChatResponse = {
    reply:
      "Mình chưa nhận được phản hồi hợp lệ từ trợ lý. Bạn thử lại giúp mình nhé.",
    products: [],
    logs: [],
  };

  if (!isRecord(payload)) {
    return fallback;
  }

  return {
    reply:
      pickString(payload.reply, payload.message, payload.response) ??
      fallback.reply,
    products: normalizeProducts(payload.products),
    action: pickString(payload.action),
    logs: Array.isArray(payload.logs)
      ? payload.logs.filter((item): item is string => typeof item === "string")
      : [],
    gpu: isRecord(payload.gpu) ? payload.gpu : undefined,
  };
}

function getChatEndpoint() {
  return new URL(
    API_ENDPOINTS.CHAT.BASE.replace(/^\//, ""),
    env.CHATBOX_URL,
  ).toString();
}

async function parseErrorResponse(response: Response) {
  const fallback = `Chat API lỗi ${response.status}`;

  try {
    const payload = (await response.json()) as unknown;
    if (isRecord(payload)) {
      return (
        pickString(
          payload.message,
          payload.reply,
          payload.error,
          payload.detail,
        ) ?? fallback
      );
    }
  } catch {
    try {
      const text = await response.text();
      if (text.trim()) {
        return text;
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(getChatEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const payload = (await response.json()) as unknown;
  return normalizeResponse(payload);
}

export function normalizeProductVariantRecommendation(
  product: ProductVariant,
): ChatRecommendation {
  return {
    id: product.id,
    routeId: product.id,
    name: product.name,
    price: pickNumber(product.price),
    color: product.color,
    quantity: product.quantity,
    description: product.description,
    brandName: product.product?.brand?.name,
    image: product.images?.[0]?.path,
  };
}
