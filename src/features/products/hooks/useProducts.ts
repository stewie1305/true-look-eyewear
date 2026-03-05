import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminProductService,
  productService,
} from "@/features/products/services";
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterParams,
} from "@/features/products/types";

/**
 * Hook lấy danh sách products với pagination và filters.
 * Đồng bộ filters với URL search params.
 */
export function useProducts(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  // Parse filters từ URL params
  const filters = useMemo<ProductFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      product_type: searchParams.get("product_type") || undefined,
      brand_name: searchParams.get("brand_name") || undefined,
      category_name: searchParams.get("category_name") || undefined,
      min_price: searchParams.get("min_price")
        ? Number(searchParams.get("min_price"))
        : undefined,
      max_price: searchParams.get("max_price")
        ? Number(searchParams.get("max_price"))
        : undefined,
      brand_id: searchParams.get("brand_id") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      status: options?.forceActive
        ? "active"
        : searchParams.get("status") || undefined,
    };
  }, [searchParams, options?.forceActive]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, filters],
    queryFn: async () => {
      console.log("🔍 Sending filters to API:", filters);
      const response = await productService.getAll(filters);
      console.log("📦 Products API Response:", response);
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

  const rawProducts = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  // Client-side filtering cho status vì backend chưa hỗ trợ
  let products = rawProducts;

  if (options?.forceActive) {
    products = products.filter(
      (product) => String(product.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    // Filter theo status từ URL params
    products = products.filter(
      (product) =>
        String(product.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    products,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook tạo product mới.
 * Sau khi thành công → invalidate cache + navigate về list.
 */
export function useCreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => adminProductService.create(data),
    onSuccess: () => {
      toast.success("Tạo sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      navigate("/admin/products");
    },
  });
}

/**
 * Hook cập nhật product.
 * Sau khi thành công → invalidate cache (list + detail) + navigate về list.
 */
export function useUpdateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      adminProductService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.id),
      });
      navigate("/admin/products");
    },
  });
}

/**
 * Hook xóa product.
 * Sau khi thành công → invalidate cache.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductService.remove(id),
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
}

/**
 * Hook lấy chi tiết 1 product.
 */
export function useProductDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: () => adminProductService.getById(id),
    enabled: !!id,
  });
}
