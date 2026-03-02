import { useAuthStore } from "@/features/auth/store";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { ModeToggle } from "@/shared/components/common/mode-toggle";

const Header = () => {
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.accessToken);

  const isActive = (pathname: string) => location.pathname === pathname;

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
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition"
        >
          True Look
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isActive("/")
                ? "bg-primary/10 text-primary underline underline-offset-4"
                : "text-foreground hover:text-primary hover:bg-muted",
            )}
          >
            Home
          </Link>

          <Link
            to="/shopping"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isActive("/shopping")
                ? "bg-primary/10 text-primary underline underline-offset-4"
                : "text-foreground hover:text-primary hover:bg-muted",
            )}
          >
            Shopping
          </Link>

          {token && (
            <Link
              to="/profile"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
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
              to="/eyewear"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive("/eyewear")
                  ? "bg-primary/10 text-primary underline underline-offset-4"
                  : "text-foreground hover:text-primary hover:bg-muted",
              )}
            >
              EyeWear
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
              className="px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              Logout
            </button>
          )}

          {/* Theme Toggle - Grouped with nav */}
          <div className="ml-2 pl-2 border-l border-border/40">
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
