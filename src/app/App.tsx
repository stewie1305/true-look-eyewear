import { Toaster } from "@/shared/components/ui/sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";
import Theme from "./providers/ThemeProvider";
import { useEffect } from "react";

declare const CozeWebSDK: any;

export default function App() {
  useEffect(() => {
    new CozeWebSDK.WebChatClient({
      config: {
        bot_id: "7617975548819931141",
      },
      componentProps: {
        title: "True Look Assistant",
      },
      auth: {
        type: "token",
        token: import.meta.env.VITE_COZE_TOKEN,
        onRefreshToken: () => import.meta.env.VITE_COZE_TOKEN,
      },
    });
  }, []);

  return (
    <QueryProvider>
      <Theme />
      <RouterProvider />
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}