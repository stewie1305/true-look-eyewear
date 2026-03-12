import type { UserRole } from "@/shared/types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  birthday?: string;
  gender?: "M" | "F";
  profilePicture?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  // ... other fields
}
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  gender: "M" | "F";
  birthday: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  subcription?: {
    hasActiveSubscription: boolean;
    subscriptionType?: string;
  };
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  roles: UserRole[];
}
export interface AuthActions {
  setAuth: (payload: {
    accessToken: string;
    role?: UserRole | null;
    roles?: UserRole[];
  }) => void;
  clearAuth: () => void;
}
export interface JwtPayload {
  sub: string;
  username: string;
  fullName?: string;
  roles?: string[];
  email?: string;
  role?: UserRole | string;
}
