import type { UserRole } from "@/shared/types";

export const ADMIN_PANEL_ROLES: UserRole[] = [
  "admin",
  "system_admin",
  "sales_staff",
  "operation_staff",
  "manager",
];

export const DEFAULT_CUSTOMER_ROLE: UserRole = "user";

export const FULL_ADMIN_ROLES: UserRole[] = ["admin", "system_admin"];

export const MANAGER_ROLES: UserRole[] = [...FULL_ADMIN_ROLES, "manager"];

export const PRODUCT_MANAGEMENT_ROLES: UserRole[] = [
  ...FULL_ADMIN_ROLES,
  "manager",
  "sales_staff",
];

export const SALES_SUPPORT_ROLES: UserRole[] = [
  ...FULL_ADMIN_ROLES,
  "sales_staff",
];

export const OPERATIONS_ROLES: UserRole[] = [
  ...FULL_ADMIN_ROLES,
  "manager",
  "operation_staff",
  "sales_staff",
];

export const ADMIN_PAGE_ACCESS: Record<string, UserRole[]> = {
  "/admin": ADMIN_PANEL_ROLES,
  "/admin/products": PRODUCT_MANAGEMENT_ROLES,
  "/admin/brands": MANAGER_ROLES,
  "/admin/categories": MANAGER_ROLES,
  "/admin/frame-specs": OPERATIONS_ROLES,
  "/admin/rx-lens-specs": OPERATIONS_ROLES,
  "/admin/contact-lens-specs": OPERATIONS_ROLES,
  "/admin/contact-lens-axis": OPERATIONS_ROLES,
  "/admin/promotions": MANAGER_ROLES,
  "/admin/orders": OPERATIONS_ROLES,
  "/admin/users": MANAGER_ROLES,
  "/admin/user-roles": FULL_ADMIN_ROLES,
  "/admin/superset": FULL_ADMIN_ROLES,
};

export const getUniqueRoles = (roles: Array<UserRole | null | undefined>) =>
  Array.from(new Set(roles.filter(Boolean))) as UserRole[];

export const hasAnyRole = (
  userRoles: UserRole[] | undefined,
  allowedRoles: UserRole[] | undefined,
) => {
  if (!allowedRoles?.length) return true;
  if (!userRoles?.length) return false;
  return userRoles.some((role) => allowedRoles.includes(role));
};

export const normalizeRole = (rawRole?: string | null): UserRole | null => {
  if (!rawRole) return null;

  const value = rawRole
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (value.includes("system") && value.includes("admin"))
    return "system_admin";
  if (
    value === "admin" ||
    value.endsWith("_admin") ||
    value.includes("admin")
  ) {
    return "admin";
  }
  if (value.includes("sales") && value.includes("staff")) return "sales_staff";
  if (value.includes("support") && value.includes("staff"))
    return "sales_staff";
  if (value.includes("operation") && value.includes("staff")) {
    return "operation_staff";
  }
  if (value.includes("manager")) return "manager";
  if (value.includes("customer")) return "customer";
  if (value.includes("user")) return "user";

  return null;
};
