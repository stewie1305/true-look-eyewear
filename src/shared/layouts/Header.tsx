import { useAuthStore } from "@/features/auth/store";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { ModeToggle } from "@/shared/components/common/mode-toggle";
import { CartIcon } from "@/features/cart/components/CartIcon";
import truelookLogo from "@/shared/pictures/trueLookLogotachnen-removebg-preview.png";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";

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
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <header
        className={cn(
          "pointer-events-auto",
          "mx-auto w-full max-w-6xl h-16 rounded-full",
          "border border-border/50 shadow-sm",
          "bg-background/80 backdrop-blur-md",
          "transition-all duration-200",
          "flex items-center justify-between px-6"
        )}
      >
        {/* ================= MOBILE MENU ================= */}
        <div className="flex md:hidden items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full cursor-pointer">Trang chủ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products" className="w-full cursor-pointer">Sản phẩm</Link>
              </DropdownMenuItem>
              {token && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">Hồ sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full cursor-pointer">Đơn hàng</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ================= LEFT NAVIGATION ================= */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            className={cn(
              "shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
              isActive("/products")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            Sản phẩm
          </Link>
          {token && (
            <Link
              to="/profile"
              className={cn(
                "shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/profile")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Hồ sơ
            </Link>
          )}
          {token && (
            <Link
              to="/orders"
              className={cn(
                "shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/orders")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Đơn hàng
            </Link>
          )}
        </nav>

        {/* ================= CENTER LOGO ================= */}
        <Link
          to="/"
          className="absolute left-1/2 top-[50%] md:top-[60%] -translate-x-1/2 -translate-y-1/2 flex items-center hover:opacity-80 transition"
        >
          <img 
            src={truelookLogo} 
            alt="True Look Logo" 
            className="h-20 md:h-28 w-auto object-contain invert dark:invert-0 scale-125 md:scale-150" 
          />
        </Link>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-1 md:gap-2">
          {token && <CartIcon />}
          <ModeToggle />
          
          {!token ? (
            <Link
              to="/login"
              className={cn(
                "ml-1 md:ml-2 px-3 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all",
                isActive("/login")
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary"
              )}
            >
              Đăng nhập
            </Link>
          ) : (
            <button
              onClick={() => logoutMutation.mutate()}
              className="ml-1 md:ml-2 shrink-0 whitespace-nowrap px-3 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
            >
              Đăng xuất
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
