const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error(
    "MISSING ENVIRONMENT VARIABLE: VITE_API_URL\n" +
      " Please set it in your .env file with the format: VITE_API_URL=http://localhost:3000/",
  );
}

const CHATBOX_URL = import.meta.env.VITE_QUEN_URL ?? API_URL;

export const env = {
  API_URL,
  CHATBOX_URL,
} as const;
