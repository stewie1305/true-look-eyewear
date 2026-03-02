import apiClient from "@/lib/axios";
import type { User, RegisterDto, LoginRequest, AuthResponse } from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
//1> dinh nghia

export const authService = {
  //Login normalize data -> accessToken/refreshToken
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<unknown>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    const root =
      typeof response === "object" && response !== null
        ? (response as unknown as Record<string, unknown>)
        : {};

    const payload =
      typeof root.data === "object" && root.data !== null
        ? (root.data as Record<string, unknown>)
        : root;

    const normalized: AuthResponse = {
      accessToken:
        (typeof payload.access_token === "string" && payload.access_token) ||
        (typeof payload.accessToken === "string" && payload.accessToken) ||
        (typeof payload.token === "string" && payload.token) ||
        "",
      refreshToken:
        (typeof payload.refresh_token === "string" && payload.refresh_token) ||
        (typeof payload.refreshToken === "string" && payload.refreshToken) ||
        undefined,
      subcription:
        typeof payload.subcription === "object" && payload.subcription !== null
          ? (payload.subcription as AuthResponse["subcription"])
          : undefined,
    };

    if (!normalized.accessToken) {
      throw new Error("Đăng nhập thành công nhưng thiếu accessToken");
    }

    return normalized;
  },
  async getMe(): Promise<User> {
    const response = await apiClient.get("users/me");
    console.log("getMe response:", response);

    // Axios interceptor đã trả về data trực tiếp
    // Nếu response là User object thì return trực tiếp
    if (response && typeof response === "object" && "id" in response) {
      return response as unknown as User;
    }

    // Nếu response còn có .data property thì lấy nó
    if (response && typeof response === "object" && "data" in response) {
      return (response as any).data as User;
    }

    return response as unknown as User;
  },
  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    ) as unknown as Promise<AuthResponse>;
  },
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  async forgotPassword(data: { email: string }): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },
  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
