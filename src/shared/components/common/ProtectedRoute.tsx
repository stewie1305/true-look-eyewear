import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/shared/types";
import { Navigate, useLocation } from "react-router";
import { hasAnyRole } from "@/shared/constants/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { accessToken, role, roles } = useAuthStore();
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const effectiveRoles = roles?.length ? roles : role ? [role] : [];
  if (allowedRoles && !hasAnyRole(effectiveRoles, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}
