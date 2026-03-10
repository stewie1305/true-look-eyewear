import { createBaseService } from "@/shared/services/BaseService";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserFilterParams,
  UserRole,
  SyncUserRolesDto,
} from "./types";

export const userService = createBaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilterParams
>({
  endpoint: API_ENDPOINTS.USERS.BASE,
  create: async (data: CreateUserDto) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.STAFF, data);
    return response as unknown as User;
  },
  update: async (id, data) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.USERS.BASE}/${id}`,
      data,
    );
    return response as unknown as User;
  },
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
  },
});

export const adminUserService = {
  getById: async (id: string | number): Promise<User> => {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    return response as unknown as User;
  },
  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
    return response as unknown as User;
  },
  updateMe: async (data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.ME, data);
    return response as unknown as User;
  },
};

export const userRoleService = {
  getRoles: async (): Promise<UserRole[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_ROLES.BASE);
    const extractRolesFromUsers = (users: any[]) => {
      const map = new Map<string, UserRole>();
      users.forEach((u) => {
        const roles = Array.isArray(u?.roles) ? u.roles : [];
        roles.forEach((r: any) => {
          if (!r) return;
          const key = `${r.id ?? r.name ?? ""}`;
          if (!key) return;
          map.set(key, { id: String(r.id ?? r.name), name: r.name ?? String(r.id) });
        });
      });
      return Array.from(map.values());
    };

    const normalize = (payload: any): UserRole[] => {
      if (!payload) return [];
      if (Array.isArray(payload)) {
        const hasUserShape = payload.some((u) => Array.isArray(u?.roles));
        if (hasUserShape) return extractRolesFromUsers(payload);
        return payload as UserRole[];
      }
      const candidates = [
        payload.data,
        payload.data?.data,
        payload.items,
        payload.roles,
        payload.data?.items,
        payload.data?.roles,
      ];
      for (const c of candidates) {
        if (Array.isArray(c)) {
          const hasUserShape = c.some((u) => Array.isArray(u?.roles));
          if (hasUserShape) return extractRolesFromUsers(c);
          return c as UserRole[];
        }
      }
      return [];
    };

    return normalize(response);
  },
  getUserRoles: async (userId: string): Promise<UserRole[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.USER_ROLES.USER(userId),
    );
    return response as unknown as UserRole[];
  },
  syncUserRoles: async (
    userId: string,
    data: SyncUserRolesDto,
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USER_ROLES.SYNC(userId), data);
  },
  removeUserRole: async (userId: string, roleId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER_ROLES.REMOVE(userId, roleId));
  },
};
