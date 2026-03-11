import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { userRoleService } from "../services";
import type { SyncUserRolesDto, UserRole, UserWithRoles } from "../types";

export function useUserRoles() {
  const query = useQuery({
    queryKey: QUERY_KEYS.USER_ROLES,
    queryFn: () => userRoleService.getAll(),
    placeholderData: (prev) => prev,
  });

  return {
    roles: (query.data ?? []) as UserRole[],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUsersWithRoles() {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.USER_ROLES, "users"],
    queryFn: () => userRoleService.getUsersWithRoles(),
    placeholderData: (prev) => prev,
  });

  return {
    users: (query.data ?? []) as UserWithRoles[],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUserRolesByUser(userId: string) {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.USER_ROLES, userId],
    queryFn: () => userRoleService.getByUserId(userId),
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });

  return {
    roles: (query.data ?? []) as UserRole[],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useSyncUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: SyncUserRolesDto }) =>
      userRoleService.sync(userId, data),
    onSuccess: (_data, variables) => {
      toast.success("Đồng bộ quyền thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ROLES });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_ROLES, variables.userId],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Đồng bộ quyền thất bại");
    },
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      roleId,
    }: {
      userId: string;
      roleId: string;
    }) => userRoleService.remove(userId, roleId),
    onSuccess: (_data, variables) => {
      toast.success("Xóa quyền thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ROLES });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_ROLES, variables.userId],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa quyền thất bại");
    },
  });
}
