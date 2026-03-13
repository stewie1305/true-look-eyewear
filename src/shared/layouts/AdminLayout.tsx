import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import {
  LayoutDashboard,
  Glasses,
  LogOut,
  Menu,
  X,
  Building2,
  Tag,
  Ruler,
  Eye,
  Users,
  Shield,
  ChartNoAxesCombined,
  ClipboardList,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { ADMIN_PAGE_ACCESS, hasAnyRole } from "@/shared/constants/roles";
import type { UserRole } from "@/shared/types";

const navigation: Array<{
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}> = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin"],
  },
  {
    name: "Quản lý Sản phẩm",
    href: "/admin/products",
    icon: Glasses,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/products"],
  },
  {
    name: "Quản lý Thương hiệu",
    href: "/admin/brands",
    icon: Building2,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/brands"],
  },
  {
    name: "Quản lý Danh mục",
    href: "/admin/categories",
    icon: Tag,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/categories"],
  },
  {
    name: "Quản lý Gọng kính",
    href: "/admin/frame-specs",
    icon: Ruler,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/frame-specs"],
  },
  {
    name: "Quản lý Tròng kính",
    href: "/admin/rx-lens-specs",
    icon: Eye,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/rx-lens-specs"],
  },
  {
    name: "Quản lý Lens",
    href: "/admin/contact-lens-specs",
    icon: Eye,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/contact-lens-specs"],
  },
  {
    name: "Quản lý Axis",
    href: "/admin/contact-lens-axis",
    icon: Eye,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/contact-lens-axis"],
  },
  {
    name: "Quản lý Khuyến mãi",
    href: "/admin/promotions",
    icon: Tag,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/promotions"],
  },
  {
    name: "Quản lý Đơn hàng",
    href: "/admin/orders",
    icon: ClipboardList,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/orders"],
  },
  {
    name: "Đơn giao Nhanh.vn",
    href: "/admin/shipping-orders",
    icon: Truck,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/shipping-orders"],
  },
  {
    name: "Quản lý Nhân viên",
    href: "/admin/users",
    icon: Users,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/users"],
  },
  {
    name: "Quản lý Phân quyền",
    href: "/admin/user-roles",
    icon: Shield,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/user-roles"],
  },
  {
    name: "Superset BI",
    href: "/admin/superset",
    icon: ChartNoAxesCombined,
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/superset"],
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, roles } = useAuthStore();
  const effectiveRoles = useMemo(
    () => (roles?.length ? roles : role ? [role] : []),
    [role, roles],
  );
  const visibleNavigation = useMemo(
    () =>
      navigation.filter((item) =>
        hasAnyRole(effectiveRoles, item.allowedRoles),
      ),
    [effectiveRoles],
  );

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link to="/admin" className="flex items-center gap-2">
              <Glasses className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {visibleNavigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {visibleNavigation.find((item) =>
              item.href === "/admin"
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href),
            )?.name || "Admin"}
          </h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
