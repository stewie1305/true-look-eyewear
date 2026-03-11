import type { BaseFilterParams } from "@/shared/types";

export interface Role {
  id: string;
  name: string;
  status?: number | string;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
}

export interface RoleFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
}
