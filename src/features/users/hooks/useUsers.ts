import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminUserService,
  userRoleService,
  userService,
} from "@/features/users/services";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserFilterParams,
} from "@/features/users/types";

export function useUsers() {
  const [searchParams] = useSearchParams();

  const filters = useMemo<UserFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      roleName: searchParams.get("roleName") || undefined,
      gender: searchParams.get("gender") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.USERS, filters],
    queryFn: async () => {
      const response = await userService.getAll(filters);
      const rawUsers = Array.isArray(response)
        ? response
        : (response?.data ?? []);

      const hasRoleInfo = (user: any) =>
        !!(
          user?.roleName ||
          user?.role ||
          (Array.isArray(user?.roles) && user.roles.length > 0) ||
          (Array.isArray(user?.userRoles) && user.userRoles.length > 0)
        );

      if (!rawUsers.length) return response;

      if (rawUsers.every((u: any) => hasRoleInfo(u))) {
        return response;
      }

      const usersWithRoles = await Promise.all(
        rawUsers.map(async (user: any) => {
          if (hasRoleInfo(user)) return user;
          try {
            const roles = await userRoleService.getUserRoles(String(user.id));
            const roleName = roles?.[0]?.name;
            return roleName ? { ...user, roleName } : user;
          } catch {
            return user;
          }
        }),
      );

      if (Array.isArray(response)) {
        return usersWithRoles;
      }

      return {
        ...response,
        data: usersWithRoles,
      };
    },
    placeholderData: (prev) => prev,
  });

  const rawUsers = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let users = rawUsers;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    users = users.filter((u: any) => {
      const username = String(u.username || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const fullName = String(u.fullName || "").toLowerCase();
      return (
        username.includes(needle) ||
        email.includes(needle) ||
        fullName.includes(needle)
      );
    });
  }

  if (filters.status) {
    users = users.filter((u: any) => {
      const status = String(u.status ?? "").toLowerCase();
      return status === String(filters.status).toLowerCase();
    });
  }

  if (filters.roleName) {
    const roleNeedle = filters.roleName.toLowerCase();
    users = users.filter((u: any) => {
      const roleName =
        u.roleName ||
        (typeof u.role === "string" ? u.role : u.role?.name) ||
        u.roles?.[0]?.name ||
        u.userRoles?.[0]?.role?.name ||
        "";
      return String(roleName).toLowerCase().includes(roleNeedle);
    });
  }

  if (filters.gender) {
    users = users.filter(
      (u: any) =>
        String(u.gender || "").toLowerCase() ===
        String(filters.gender).toLowerCase(),
    );
  }

  return {
    users,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: () => {
      toast.success("Tạo user thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      navigate("/admin/users");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo user thất bại");
    },
  });
}

export function useUpdateUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật user thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_DETAIL(variables.id),
      });
      navigate("/admin/users");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật user thất bại");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      toast.success("Khóa tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Khóa tài khoản thất bại");
    },
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USER_DETAIL(id),
    queryFn: () => adminUserService.getById(id),
    enabled: !!id,
  });
}

export function useUserMe() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => adminUserService.getMe(),
  });
}

export function useUpdateUserMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => adminUserService.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Cập nhật hồ sơ thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật hồ sơ thất bại");
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_ROLES,
    queryFn: () => userRoleService.getRoles(),
    placeholderData: (prev) => prev,
  });
}
