import type { BaseFilterParams } from "@/shared/types";

export type UserStatus = 0 | 1 | "active" | "inactive";

export interface UserRole {
  id: string;
  name: string;
  status?: UserStatus;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  gender?: "M" | "F" | string;
  birthday?: string;
  status?: UserStatus;
  roleName?: string;
  role?: string | { id?: string; name?: string };
  roles?: UserRole[];
  userRoles?: Array<{ role?: UserRole }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  status: UserStatus;
  roleName: string;
  username: string;
  password: string;
  fullName: string;
  gender: string;
  email: string;
  birthday: string;
}

export interface UpdateUserDto {
  status?: UserStatus;
  roleName?: string;
  username?: string;
  password?: string;
  fullName?: string;
  gender?: string;
  email?: string;
  birthday?: string;
}

export interface UserFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
  roleName?: string;
  gender?: string;
}

export interface SyncUserRolesDto {
  roleIds: string[];
}
