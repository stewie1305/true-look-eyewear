import { useAuthStore } from "@/features/auth/store";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
    const {accessToken,role} = useAuthStore();

    if(accessToken){
        const redirectTo = role === "admin" ? "/admin" : "/";
        return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
}