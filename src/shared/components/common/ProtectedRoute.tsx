
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/shared/types";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[]
}
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
 const location = useLocation();
    const { accessToken, role } = useAuthStore();
    if(!accessToken){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if(allowedRoles && !allowedRoles.includes(role!)){
        return <Navigate to="/unauthorized" replace />;
    }
    return <>{children}</>;
}