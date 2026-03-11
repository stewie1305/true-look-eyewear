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

export function useProducts(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

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
      const response = await productService.getAll(filters);
      if (!Array.isArray(response) && response?.data) {
      }
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawProducts = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let products = rawProducts;

  if (options?.forceActive) {
    products = products.filter(
      (product) => String(product.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {

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


export function useProductDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: () => adminProductService.getById(id),
    enabled: !!id,
  });
}
