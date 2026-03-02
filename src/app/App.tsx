import { Toaster } from "@/shared/components/ui/sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";
import Theme from "./providers/ThemeProvider";

export default function App() {
  return (
      <QueryProvider>
        <Theme />
        <RouterProvider />
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
  );
}
