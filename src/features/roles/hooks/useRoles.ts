import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { roleService } from "@/features/roles/services";
import type {
  CreateRoleDto,
  UpdateRoleDto,
  RoleFilterParams,
} from "@/features/roles/types";

export function useRoles() {
  const [searchParams] = useSearchParams();

  const filters = useMemo<RoleFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.ROLES, filters],
    queryFn: async () => {
      const response = await roleService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawRoles = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let roles = rawRoles;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    roles = roles.filter((r: any) =>
      String(r.name || "").toLowerCase().includes(needle),
    );
  }

  if (filters.status) {
    roles = roles.filter(
      (r: any) =>
        String(r.status ?? "").toLowerCase() ===
        String(filters.status).toLowerCase(),
    );
  }

  return {
    roles,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateRole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => roleService.create(data),
    onSuccess: () => {
      toast.success("Tạo quyền thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      navigate("/admin/roles");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo quyền thất bại");
    },
  });
}

export function useUpdateRole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      roleService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật quyền thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROLE_DETAIL(variables.id),
      });
      navigate("/admin/roles");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật quyền thất bại");
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.remove(id),
    onSuccess: () => {
      toast.success("Xóa quyền thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa quyền thất bại");
    },
  });
}

export function useRoleDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ROLE_DETAIL(id),
    queryFn: () => roleService.getById(id),
    enabled: !!id,
  });
}
