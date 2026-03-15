const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error(
    "MISSING ENVIRONMENT VARIABLE: VITE_API_URL\n" +
      " Please set it in your .env file with the format: VITE_API_URL=http://localhost:3000/",
  );
}

export const env = {
  API_URL,
} as const;

export const getImageUrl = (path?: string): string => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const base = API_URL.replace(/\/+$/, "");
  const normalizedPath = path
    .trim()
    .replace(/^\.\//, "")
    .replace(/^\/?src\/uploads\//, "uploads/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;
  return `${base}${cleanPath}`;
};
