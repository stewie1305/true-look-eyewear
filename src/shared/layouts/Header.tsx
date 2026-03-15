import { useAuthStore } from "@/features/auth/store";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { ModeToggle } from "@/shared/components/common/mode-toggle";
import { CartIcon } from "@/features/cart/components/CartIcon";

const Header = () => {
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.accessToken);

  const isActive = (pathname: string) =>
    pathname === "/"
      ? location.pathname === pathname
      : location.pathname === pathname ||
        location.pathname.startsWith(`${pathname}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border/40",
        "bg-background/95 backdrop-blur-md",
        "supports-backdrop-filter:bg-background/60",
        "transition-all duration-200",
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center gap-4 px-4">
        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="shrink-0 flex flex-col leading-none hover:opacity-80 transition"
        >
          {/* Main Brand */}
          <div
            className="flex items-center text-[34px] tracking-[4px] text-primary"
            style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600 }}
          >
            TRUE&nbsp;L
            {/* OO thành kính */}
            <span className="relative flex items-center mx-1">
              <span className="w-5 h-5 border border-current rounded-full"></span>
              <span className="w-5 h-5 border border-current rounded-full -ml-1"></span>

              {/* Bridge */}
              <span className="absolute w-3 h-px bg-current left-1/2 -translate-x-1/2"></span>
            </span>
            K
          </div>

          {/* Subtitle */}
          <span
            className="text-[10px] tracking-[6px] text-muted-foreground mt-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            EYEWEAR
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <nav className="ml-auto flex min-w-0 items-center gap-0.5">
          <Link
            to="/"
            className={cn(
              "shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all",
              isActive("/")
                ? "bg-primary/10 text-primary underline underline-offset-4"
                : "text-foreground hover:text-primary hover:bg-muted",
            )}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={cn(
              "shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all",
              isActive("/products")
                ? "bg-primary/10 text-primary underline underline-offset-4"
                : "text-foreground hover:text-primary hover:bg-muted",
            )}
          >
            EyeWears
          </Link>

          {token && (
            <Link
              to="/profile"
              className={cn(
                "shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive("/profile")
                  ? "bg-primary/10 text-primary underline underline-offset-4"
                  : "text-foreground hover:text-primary hover:bg-muted",
              )}
            >
              Profile
            </Link>
          )}

          {token && (
            <Link
              to="/orders"
              className={cn(
                "shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive("/orders")
                  ? "bg-primary/10 text-primary underline underline-offset-4"
                  : "text-foreground hover:text-primary hover:bg-muted",
              )}
            >
              Orders
            </Link>
          )}

          {!token ? (
            <Link
              to="/login"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive("/login")
                  ? "bg-primary/10 text-primary underline underline-offset-4"
                  : "text-foreground hover:text-primary hover:bg-muted",
              )}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => logoutMutation.mutate()}
              className="shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              Logout
            </button>
          )}

          {/* Cart & Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-border/40 flex items-center gap-3">
            {token && <CartIcon />}
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
