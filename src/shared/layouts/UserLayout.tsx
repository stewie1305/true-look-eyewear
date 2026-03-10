import { Footer } from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-background via-muted/20 to-background">
      {/* HEADER */}
      <Header />

      {/* MAIN */}

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
