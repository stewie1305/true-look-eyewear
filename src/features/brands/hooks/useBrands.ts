import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import { adminBrandService, brandService } from "@/features/brands/services";
import type {
  CreateBrandDto,
  UpdateBrandDto,
  BrandFilterParams,
} from "@/features/brands/types";

export function useBrands(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();
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
      const response = await brandService.getAll(filters);
      if (!Array.isArray(response) && response?.data) {
      }
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawBrands = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);
  let brands = rawBrands;


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
export function useBrandDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BRAND_DETAIL(id),
    queryFn: () => adminBrandService.getById(id),
    enabled: !!id,
  });
}
