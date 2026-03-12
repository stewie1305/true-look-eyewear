import { useAuthStore } from "@/features/auth/store";
import { Navigate } from "react-router-dom";
import { ADMIN_PANEL_ROLES, hasAnyRole } from "@/shared/constants/roles";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { accessToken, role, roles } = useAuthStore();

  if (accessToken) {
    const effectiveRoles = roles?.length ? roles : role ? [role] : [];
    const redirectTo = hasAnyRole(effectiveRoles, ADMIN_PANEL_ROLES)
      ? "/admin"
      : "/";
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
