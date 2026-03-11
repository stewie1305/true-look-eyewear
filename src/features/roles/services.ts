import { createBaseService } from "@/shared/services/BaseService";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleFilterParams,
} from "./types";

export const roleService = createBaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleFilterParams
>({
  endpoint: API_ENDPOINTS.ROLES.BASE,
  getAll: async (params?: RoleFilterParams) => {
    return apiClient.get(`${API_ENDPOINTS.ROLES.BASE}/findAll`, {
      params,
    }) as unknown as Promise<any>;
  },
  getById: async (id: string | number) => {
    return apiClient.get(
      `${API_ENDPOINTS.ROLES.BASE}/findOne/${id}`,
    ) as unknown as Promise<Role>;
  },
  create: async (data: CreateRoleDto) => {
    return apiClient.post(
      `${API_ENDPOINTS.ROLES.BASE}/create`,
      data,
    ) as unknown as Promise<Role>;
  },
  update: async (id: string | number, data: UpdateRoleDto) => {
    return apiClient.patch(
      `${API_ENDPOINTS.ROLES.BASE}/update/${id}`,
      data,
    ) as unknown as Promise<Role>;
  },
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.ROLES.BASE}/remove/${id}`);
  },
});
