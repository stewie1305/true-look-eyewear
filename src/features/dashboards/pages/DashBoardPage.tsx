import { useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Users,
  Image as ImageIcon,
  Glasses,
  Tag,
  ShoppingBag,
  Shield,
  Truck,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { ADMIN_PAGE_ACCESS, hasAnyRole } from "@/shared/constants/roles";
import type { UserRole } from "@/shared/types";
import { cn } from "@/lib/utils";

const ACTION_CONFIG: Array<{
  to: string;
  label: string;
  description: string;
  icon: typeof Glasses;
  color: string;
  bg: string;
  allowedRoles: UserRole[];
}> = [
  {
    to: "/admin/products",
    label: "Sản phẩm",
    description: "Quản lý biến thể kính",
    icon: Glasses,
    color: "text-blue-500",
    bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/products"],
  },
  {
    to: "/admin/images",
    label: "Hình ảnh",
    description: "Upload & quản lý ảnh",
    icon: ImageIcon,
    color: "text-violet-500",
    bg: "bg-violet-500/10 group-hover:bg-violet-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/images"],
  },
  {
    to: "/admin/promotions",
    label: "Khuyến mãi",
    description: "Mã giảm giá & ưu đãi",
    icon: Tag,
    color: "text-rose-500",
    bg: "bg-rose-500/10 group-hover:bg-rose-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/promotions"],
  },
  {
    to: "/admin/orders",
    label: "Đơn hàng",
    description: "Theo dõi & xử lý đơn",
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/orders"],
  },
  {
    to: "/admin/support",
    label: "Hỗ trợ Khách hàng",
    description: "Hỗ trợ & tin nhắn",
    icon: MessageSquare,
    color: "text-slate-700",
    bg: "bg-slate-700/10 group-hover:bg-slate-700/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/support"],
  },
  {
    to: "/admin/ahamove-orders",
    label: "Giao hàng Ahamove",
    description: "Quản lý đơn Ahamove",
    icon: Truck,
    color: "text-amber-500",
    bg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/ahamove-orders"],
  },
  {
    to: "/admin/users",
    label: "Nhân viên",
    description: "Quản lý tài khoản nội bộ",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/users"],
  },
  {
    to: "/admin/user-roles",
    label: "Phân quyền",
    description: "Quản lý quyền người dùng",
    icon: Shield,
    color: "text-cyan-600",
    bg: "bg-cyan-600/10 group-hover:bg-cyan-600/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/user-roles"],
  },
];

export default function DashboardPage() {
  const { role, roles } = useAuthStore();
  const effectiveRoles = useMemo(
    () => (roles?.length ? roles : role ? [role] : []),
    [role, roles],
  );

  const visibleActions = useMemo(
    () =>
      ACTION_CONFIG.filter((item) =>
        hasAnyRole(effectiveRoles, item.allowedRoles),
      ),
    [effectiveRoles],
  );

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  const roleLabel: Record<string, string> = {
    admin: "Admin",
    system_admin: "System Admin",
    manager: "Manager",
    sales_staff: "Sales Staff",
    operation_staff: "Operation Staff",
    user: "User",
  };

  const displayRole = role ? (roleLabel[role] ?? role) : "";

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">
              {now.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}! 👋
            </h1>
            {displayRole && (
              <p className="text-muted-foreground text-sm">
                Đăng nhập với quyền{" "}
                <span className="font-semibold text-foreground">
                  {displayRole}
                </span>
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
            <LayoutGrid className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {visibleActions.length} chức năng
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Truy cập nhanh
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                    item.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", item.color)} />
                </div>

                {/* Text */}
                <div className="space-y-0.5 flex-1">
                  <p className="font-semibold text-sm leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground/30 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
