import type { BaseFilterParams } from "@/shared/types";

export interface UserRole {
  id: string;
  name: string;
  status?: string | number;
}

export interface UserWithRoles {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  roles?: UserRole[];
}

export interface UserRoleFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
}

export interface SyncUserRolesDto {
  roleIds: string[];
}
