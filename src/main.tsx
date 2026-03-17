import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "@/app/App";

// Initialize Coze token from env
const cozeToken = import.meta.env.VITE_COZE_TOKEN;
if (cozeToken) {
  (window as any).__COZE_TOKEN__ = cozeToken;
  // Call init function from HTML
  setTimeout(() => {
    if (typeof (window as any).initializeCozeChat === 'function') {
      (window as any).initializeCozeChat();
      console.log('Coze chatbot initialized');
    }
  }, 500);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);




