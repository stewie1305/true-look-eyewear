import { useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  Users,
  Eye,
  Image as ImageIcon,
  Glasses,
  Building2,
  Tag,
  Ruler,
  ShoppingBag,
  Contact,
  Axis3D,
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
    to: "/admin/brands",
    label: "Thương hiệu",
    description: "Quản lý nhãn hiệu kính",
    icon: Building2,
    color: "text-orange-500",
    bg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/brands"],
  },
  {
    to: "/admin/categories",
    label: "Danh mục",
    description: "Phân loại sản phẩm",
    icon: Tag,
    color: "text-green-500",
    bg: "bg-green-500/10 group-hover:bg-green-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/categories"],
  },
  {
    to: "/admin/frame-specs",
    label: "Gọng kính",
    description: "Thông số gọng kính",
    icon: Ruler,
    color: "text-teal-500",
    bg: "bg-teal-500/10 group-hover:bg-teal-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/frame-specs"],
  },
  {
    to: "/admin/rx-lens-specs",
    label: "Tròng kính",
    description: "Thông số tròng kính Rx",
    icon: Eye,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/rx-lens-specs"],
  },
  {
    to: "/admin/contact-lens-specs",
    label: "Kính áp tròng",
    description: "Thông số contact lens",
    icon: Contact,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/contact-lens-specs"],
  },
  {
    to: "/admin/contact-lens-axis",
    label: "Trục kính",
    description: "Quản lý axis kính áp tròng",
    icon: Axis3D,
    color: "text-amber-500",
    bg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/contact-lens-axis"],
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
    to: "/admin/users",
    label: "Nhân viên",
    description: "Quản lý tài khoản nội bộ",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/users"],
  },
  {
    to: "/admin/superset",
    label: "Analytics",
    description: "Báo cáo & thống kê",
    icon: BarChart3,
    color: "text-slate-400",
    bg: "bg-slate-500/10 group-hover:bg-slate-500/20",
    allowedRoles: ADMIN_PAGE_ACCESS["/admin/superset"],
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
