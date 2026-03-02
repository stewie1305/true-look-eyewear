import { Footer } from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-background via-muted/20 to-background">
      {/* HEADER - full width, sticky hoạt động đúng */}
      <Header />

      {/* MAIN */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto w-full p-6">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
