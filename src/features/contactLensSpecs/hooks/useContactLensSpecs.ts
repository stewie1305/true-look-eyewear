import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminContactLensSpecService,
  contactLensSpecService,
} from "@/features/contactLensSpecs/services";
import type {
  CreateContactLensSpecDto,
  UpdateContactLensSpecDto,
  ContactLensSpecFilterParams,
} from "@/features/contactLensSpecs/types";

/**
 * Hook lấy danh sách contact lens specs với pagination và filters.
 * Đồng bộ filters với URL search params.
 *
 * @param options - Options bao gồm forceActive để chỉ lấy specs active
 * @returns Object chứa contactLensSpecs, pagination, loading state và error
 */
export function useContactLensSpecs(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  // Parse filters từ URL params
  const filters = useMemo<ContactLensSpecFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      product_id: searchParams.get("product_id") || undefined,
      status: options?.forceActive
        ? "active"
        : searchParams.get("status") || undefined,
    };
  }, [searchParams, options?.forceActive]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.CONTACT_LENS_SPECS, filters],
    queryFn: async () => {
      const response = await contactLensSpecService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawData = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  // Client-side filtering cho status
  let contactLensSpecs = rawData;

  if (options?.forceActive) {
    contactLensSpecs = contactLensSpecs.filter(
      (item) => String(item.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    contactLensSpecs = contactLensSpecs.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    contactLensSpecs,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook tạo contact lens spec mới.
 * axis_min được chọn từ danh sách axis_value có sẵn trong ContactLensAxis.
 * Sau khi thành công → invalidate cache + navigate về list.
 *
 * @returns Mutation object với mutate function để tạo contact lens spec
 */
export function useCreateContactLensSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactLensSpecDto) =>
      adminContactLensSpecService.create(data),
    onSuccess: () => {
      toast.success("Tạo contact lens spec thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_SPECS,
      });
      navigate("/admin/contact-lens-specs");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi tạo contact lens spec");
    },
  });
}

/**
 * Hook cập nhật contact lens spec.
 * Sau khi thành công → invalidate cache (list + detail) + navigate về list.
 *
 * @returns Mutation object với mutate function nhận {id, data}
 */
export function useUpdateContactLensSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateContactLensSpecDto;
    }) => adminContactLensSpecService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật contact lens spec thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_SPECS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_SPEC_DETAIL(variables.id),
      });
      navigate("/admin/contact-lens-specs");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi cập nhật contact lens spec");
    },
  });
}

/**
 * Hook xóa contact lens spec.
 * Sau khi thành công → invalidate cache để refresh list.
 *
 * @returns Mutation object với mutate function nhận id của spec cần xóa
 */
export function useDeleteContactLensSpec() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminContactLensSpecService.remove(id),
    onSuccess: () => {
      toast.success("Xóa contact lens spec thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONTACT_LENS_SPECS,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Lỗi xóa contact lens spec");
    },
  });
}

/**
 * Hook lấy chi tiết contact lens spec theo ID.
 *
 * @param id - ID của contact lens spec
 * @returns Query object với data là ContactLensSpecResponse
 */
export function useContactLensSpecDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACT_LENS_SPEC_DETAIL(id),
    queryFn: () => adminContactLensSpecService.getById(id),
    enabled: !!id,
  });
}
