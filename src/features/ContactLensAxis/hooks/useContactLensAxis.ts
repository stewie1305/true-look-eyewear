import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminContactLensAxisService,
  contactLensAxisService,
} from "@/features/contactLensAxis/services";
import type {
  CreateContactLensAxisDto,
  UpdateContactLensAxisDto,
  ContactLensAxisFilterParams,
} from "@/features/contactLensAxis/types";

/**
 * Hook lấy danh sách contact lens axis với pagination và filters.
 * Đồng bộ filters với URL search params.
 */
export function useContactLensAxis(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  // Parse filters từ URL params
  const filters = useMemo<ContactLensAxisFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      contact_lens_spec_id:
        searchParams.get("contact_lens_spec_id") || undefined,
      status: options?.forceActive
        ? "active"
        : searchParams.get("status") || undefined,
    };
  }, [searchParams, options?.forceActive]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.CONTACT_LENS_AXIS, filters],
    queryFn: async () => {
      const response = await contactLensAxisService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawData = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  // Client-side filtering cho status
  let contactLensAxis = rawData;

  if (options?.forceActive) {
    contactLensAxis = contactLensAxis.filter(
      (item) => String(item.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    contactLensAxis = contactLensAxis.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    contactLensAxis,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook tạo contact lens axis mới.
 * Sau khi thành công → invalidate cache + navigate về list.
 */
export function useCreateContactLensAxis() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactLensAxisDto) =>
      adminContactLensAxisService.create(data),
    onSuccess: () => {
      toast.success("Tạo contact lens axis thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_AXIS,
      });
      navigate("/admin/contact-lens-axis");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi tạo contact lens axis");
    },
  });
}

/**
 * Hook cập nhật contact lens axis.
 * Sau khi thành công → invalidate cache (list + detail) + navigate về list.
 */
export function useUpdateContactLensAxis() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateContactLensAxisDto;
    }) => adminContactLensAxisService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật contact lens axis thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_AXIS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_AXIS_DETAIL(variables.id),
      });
      navigate("/admin/contact-lens-axis");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi cập nhật contact lens axis");
    },
  });
}

/**
 * Hook xóa contact lens axis.
 * Sau khi thành công → invalidate cache.
 */
export function useDeleteContactLensAxis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminContactLensAxisService.remove(id),
    onSuccess: () => {
      toast.success("Xóa contact lens axis thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_AXIS,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi xóa contact lens axis");
    },
  });
}

/**
 * Hook lấy chi tiết 1 contact lens axis.
 */
export function useContactLensAxisDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACT_LENS_AXIS_DETAIL(id),
    queryFn: () => adminContactLensAxisService.getById(id),
    enabled: !!id,
  });
}
