import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminCategoryService,
  categoryService,
  publicCategoryService,
} from "@/features/categories/services";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams,
} from "@/features/categories/types";

/**
 * Hook lay danh sach categories voi pagination va filters.
 * Dong bo filters voi URL search params.
 */
export function useCategories(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  const filters = useMemo<CategoryFilterParams>(() => {
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
    queryKey: [...QUERY_KEYS.CATEGORIES, filters],
    queryFn: async () => {
      const response = await categoryService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawCategories = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let categories = rawCategories;

  if (filters.search) {
    categories = categories.filter((category) =>
      category.name.toLowerCase().includes(filters.search!.toLowerCase()),
    );
  }

  if (options?.forceActive) {
    categories = categories.filter(
      (category) => String(category.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    categories = categories.filter(
      (category) =>
        String(category.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    categories,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook lay danh sach category active cho user pages.
 */
export function useActiveCategories() {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, "active"],
    queryFn: async () => {
      const response = await publicCategoryService.getActive();
      return Array.isArray(response) ? response : [];
    },
    placeholderData: (prev) => prev,
  });

  return {
    categories: (query.data ?? []) as Category[],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook tao category moi.
 * Sau khi thanh cong -> invalidate cache + navigate ve list.
 */
export function useCreateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => adminCategoryService.create(data),
    onSuccess: () => {
      toast.success("Tao danh muc thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      navigate("/admin/categories");
    },
  });
}

/**
 * Hook cap nhat category.
 * Sau khi thanh cong -> invalidate cache (list + detail) + navigate ve list.
 */
export function useUpdateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      adminCategoryService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cap nhat danh muc thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORY_DETAIL(variables.id),
      });
      navigate("/admin/categories");
    },
  });
}

/**
 * Hook xoa category.
 * Sau khi thanh cong -> invalidate cache.
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCategoryService.remove(id),
    onSuccess: () => {
      toast.success("Xoa danh muc thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });
}

/**
 * Hook lay chi tiet 1 category.
 */
export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY_DETAIL(id),
    queryFn: () => adminCategoryService.getById(id),
    enabled: !!id,
  });
}
