import { authService } from "../services";
import { useAuthStore } from "../store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type {
  AuthResponse,
  JwtPayload,
  LoginRequest,
  RegisterDto,
} from "../types";
import { jwtDecode } from "jwt-decode";

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: () => {
      toast.success("Dang ki thanh cong!", {
        description: "Vui long dang nhap de tiep tuc",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Dang ki that bai, vui long thu lai",
      );
    },
    onSettled: () => {},
  });
};
export const useLoginMutation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/profile";
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (response) => {
      let decoded: JwtPayload | null = null;
      let userRole: "admin" | "user" | null = null;

      try {
        decoded = jwtDecode<JwtPayload>(response.accessToken);
        if (
          decoded.roles &&
          Array.isArray(decoded.roles) &&
          decoded.roles.length > 0
        ) {
          const roleStr = decoded.roles[0].toLowerCase();
          if (roleStr.includes("admin")) {
            userRole = "admin";
          } else {
            userRole = "user";
          }
        } else if (decoded.role) {
          userRole = decoded.role;
        }
      } catch {
        decoded = null;
      }

      setAuth({
        accessToken: response.accessToken,
        role: userRole,
      });
      toast.success("Đăng nhập thành công");
      if (userRole === "admin") {
        navigate("/admin/rituals", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại");
    },
  });
};
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
      toast.info("Đăng xuất thành công");
    },

    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success("Đã gửi email khôi phục mật khẩu", {
        description: "Vui lòng kiểm tra email của bạn",
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gửi email thất bại, vui lòng thử lại",
      );
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { email: string; otp: string; newPassword: string }) =>
      authService.resetPassword(data),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công", {
        description: "Vui lòng đăng nhập với mật khẩu mới",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Đặt lại mật khẩu thất bại, vui lòng thử lại",
      );
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công", {
        description: "Mật khẩu của bạn đã được cập nhật",
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Đổi mật khẩu thất bại, vui lòng thử lại",
      );
    },
  });
};
