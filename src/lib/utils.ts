import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imageId?: string | number | null): string {
  if (!imageId) return "";
  const apiOrigin = new URL(
    env.API_URL.endsWith("/") ? env.API_URL : `${env.API_URL}/`,
  ).origin;
  return `${apiOrigin}/images/${imageId}`;
}

export function resolveMediaUrl(path?: string | null): string {
  if (!path) return "";

  const raw = path.trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  let normalized = raw.replace(/\\/g, "/");

  // backend đôi khi trả về prefix lỗi kiểu "$rw/uploads/..."
  if (/^\$rw\/uploads\//i.test(normalized)) {
    normalized = normalized.replace(/^\$rw\/uploads\//i, "uploads/");
  } else if (/^\$rw\//i.test(normalized)) {
    normalized = normalized.replace(/^\$rw\//i, "");
  } else {
    normalized = normalized.replace(/^\$[a-z]+\//i, "");
  }

  // backend lưu path dạng "src/uploads/..." nhưng serve ở "/uploads/"
  if (/^src\/uploads\//i.test(normalized)) {
    normalized = normalized.replace(/^src\/uploads\//i, "uploads/");
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  const apiOrigin = new URL(
    env.API_URL.endsWith("/") ? env.API_URL : `${env.API_URL}/`,
  ).origin;

  return `${apiOrigin}${normalized}`;
}
