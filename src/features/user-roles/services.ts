import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { SyncUserRolesDto, UserRole, UserWithRoles } from "./types";

const toRole = (item: any): UserRole | null => {
  if (!item) return null;
  const candidate = item?.role ?? item;
  if (!candidate) return null;
  const rawId =
    candidate.id ??
    candidate.roleId ??
    candidate.code ??
    candidate.name ??
    candidate.roleName;
  const rawName =
    candidate.name ??
    candidate.roleName ??
    candidate.code ??
    candidate.id ??
    candidate.roleId;

  if (!rawId && !rawName) return null;
  return {
    id: String(rawId ?? rawName),
    name: String(rawName ?? rawId),
    status: candidate.status,
  };
};

const extractRolesFromUsers = (users: any[]): UserRole[] => {
  const map = new Map<string, UserRole>();
  users.forEach((u) => {
    const rawRoles = Array.isArray(u?.roles)
      ? u.roles
      : Array.isArray(u?.userRoles)
        ? u.userRoles.map((ur: any) => ur?.role).filter(Boolean)
        : [];
    rawRoles.forEach((r: any) => {
      const role = toRole(r);
      if (!role) return;
      const key = String(role.id ?? role.name ?? "");
      if (!key) return;
      map.set(key, role);
    });
  });
  return Array.from(map.values());
};

const normalizeRoles = (payload: any): UserRole[] => {
  if (!payload) return [];
  const isUserObject =
    payload &&
    !Array.isArray(payload) &&
    (payload.username ||
      payload.fullName ||
      payload.email ||
      Array.isArray(payload?.roles) ||
      Array.isArray(payload?.userRoles));
  if (isUserObject) {
    return extractRolesFromUsers([payload]);
  }
  if (Array.isArray(payload)) {
    const hasUserShape = payload.some(
      (u) =>
        u &&
        (u.username ||
          u.fullName ||
          u.email ||
          Array.isArray(u?.roles) ||
          Array.isArray(u?.userRoles)),
    );
    if (hasUserShape) return extractRolesFromUsers(payload);
    return payload.map(toRole).filter(Boolean) as UserRole[];
  }

  const candidates = [
    payload.data,
    payload.items,
    payload.data?.data,
    payload.data?.items,
    payload.roles,
    payload.data?.roles,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) {
      const hasUserShape = c.some(
        (u) =>
          u &&
          (u.username ||
            u.fullName ||
            u.email ||
            Array.isArray(u?.roles) ||
            Array.isArray(u?.userRoles)),
      );
      if (hasUserShape) return extractRolesFromUsers(c);
      return c.map(toRole).filter(Boolean) as UserRole[];
    }
  }

  return [];
};

const toUser = (item: any): UserWithRoles | null => {
  if (!item) return null;
  const id = item.id ?? item.userId ?? item._id;
  if (!id && !item.username && !item.fullName && !item.email) return null;
  const roles = extractRolesFromUsers([item]);
  return {
    id: String(id ?? item.username ?? item.email ?? ""),
    username: item.username ?? item.userName ?? item.email,
    fullName: item.fullName ?? item.full_name ?? item.name,
    email: item.email,
    roles,
  };
};

const normalizeUsers = (payload: any): UserWithRoles[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map(toUser).filter(Boolean) as UserWithRoles[];
  }
  const candidates = [
    payload.data,
    payload.items,
    payload.data?.data,
    payload.data?.items,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c.map(toUser).filter(Boolean) as UserWithRoles[];
    }
  }
  return [];
};

export const userRoleService = {
  getAll: async (): Promise<UserRole[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_ROLES.BASE);
    return normalizeRoles(response);
  },
  getUsersWithRoles: async (): Promise<UserWithRoles[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_ROLES.BASE);
    return normalizeUsers(response);
  },
  getByUserId: async (userId: string): Promise<UserRole[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_ROLES.USER(userId));
    return normalizeRoles(response);
  },
  sync: async (userId: string, data: SyncUserRolesDto): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USER_ROLES.SYNC(userId), data);
  },
  remove: async (userId: string, roleId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER_ROLES.REMOVE(userId, roleId));
  },
};
