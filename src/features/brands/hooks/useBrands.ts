import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminBrandService,
  brandService,
} from "@/features/brands/services";
import type {
  CreateBrandDto,
  UpdateBrandDto,
  BrandFilterParams,
} from "@/features/brands/types";

/**
 * Hook lấy danh sách brands với pagination và filters.
 * Đồng bộ filters với URL search params.
 */
export function useBrands(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  // Parse filters từ URL params
  const filters = useMemo<BrandFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      status: options?.forceActive
        ? "active"
        : searchParams.get("status") || undefined,
    };
  }, [searchParams, options?.forceActive]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.BRANDS, filters],
    queryFn: async () => {
      console.log("🔍 Sending filters to API:", filters);
      const response = await brandService.getAll(filters);
      console.log("📦 Brands API Response:", response);
      console.log(
        "📊 Response data type:",
        Array.isArray(response) ? "Array" : "Object",
      );
      if (!Array.isArray(response) && response?.data) {
        console.log("📝 Response.data:", response.data);
      }
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawBrands = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  // Client-side filtering cho status & search vì backend chưa hỗ trợ
  let brands = rawBrands;

  // Filter theo search text
  if (filters.search) {
    brands = brands.filter((brand) =>
      brand.name.toLowerCase().includes(filters.search!.toLowerCase()),
    );
  }

  if (options?.forceActive) {
    brands = brands.filter(
      (brand) => String(brand.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    // Filter theo status từ URL params
    brands = brands.filter(
      (brand) =>
        String(brand.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    brands,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook tạo brand mới.
 * Sau khi thành công → invalidate cache + navigate về list.
 */
export function useCreateBrand() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandDto) => adminBrandService.create(data),
    onSuccess: () => {
      toast.success("Tạo thương hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRANDS });
      navigate("/admin/brands");
    },
  });
}

/**
 * Hook cập nhật brand.
 * Sau khi thành công → invalidate cache (list + detail) + navigate về list.
 */
export function useUpdateBrand() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      adminBrandService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật thương hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRANDS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BRAND_DETAIL(variables.id),
      });
      navigate("/admin/brands");
    },
  });
}

/**
 * Hook xóa brand.
 * Sau khi thành công → invalidate cache.
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminBrandService.remove(id),
    onSuccess: () => {
      toast.success("Xóa thương hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRANDS });
    },
  });
}

/**
 * Hook lấy chi tiết 1 brand.
 */
export function useBrandDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BRAND_DETAIL(id),
    queryFn: () => adminBrandService.getById(id),
    enabled: !!id,
  });
}
