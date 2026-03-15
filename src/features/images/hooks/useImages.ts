import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { adminImageService, imageService } from "../services";
import type { CreateImagePayload, ImageFilterParams } from "../types";
import { productService } from "@/features/products/services";
import type { ProductVariant } from "@/features/products/types";
import { QUERY_KEYS } from "@/shared/constants";

export function useImages() {
  const [searchParams] = useSearchParams();

  const filters = useMemo<ImageFilterParams>(
    () => ({
      search: searchParams.get("search") || undefined,
      variant_id: searchParams.get("variant_id") || undefined,
    }),
    [searchParams],
  );

  const query = useQuery({
    queryKey: [...QUERY_KEYS.IMAGES, filters],
    queryFn: () => imageService.getAll(),
    placeholderData: (prev) => prev,
  });

  let images = Array.isArray(query.data) ? query.data : [];

  if (filters.search) {
    const searchValue = filters.search.trim();
    const isNumeric = /^\d+$/.test(searchValue);
    if (isNumeric) {
      images = images.filter(
        (image) => String(image.variant_id || "") === searchValue,
      );
    } else {
      const needle = searchValue.toLowerCase();
      images = images.filter((image) => {
        const variantName = String(image.variant?.name || "").toLowerCase();
        const variantCode = String(image.variant?.code || "").toLowerCase();
        const productName = String(
          image.variant?.product?.name || "",
        ).toLowerCase();
        return (
          String(image.id || "")
            .toLowerCase()
            .includes(needle) ||
          String(image.path || "")
            .toLowerCase()
            .includes(needle) ||
          String(image.variant_id || "")
            .toLowerCase()
            .includes(needle) ||
          variantName.includes(needle) ||
          variantCode.includes(needle) ||
          productName.includes(needle)
        );
      });
    }
  }

  if (filters.variant_id) {
    images = images.filter(
      (image) => String(image.variant_id || "") === String(filters.variant_id),
    );
  }

  return {
    images,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useImageDetail(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: QUERY_KEYS.IMAGE_DETAIL(id),
    queryFn: async () => {
      const cachedEntries = queryClient.getQueriesData({
        queryKey: QUERY_KEYS.IMAGES,
      });
      const cachedImages = cachedEntries
        .flatMap(([, data]) => (Array.isArray(data) ? data : []))
        .filter(Boolean);
      const cachedMatch = cachedImages.find(
        (image) => String(image.id) === String(id),
      );
      if (cachedMatch) {
        return cachedMatch;
      }

      const images = await imageService.getAll();
      return (
        images.find((image) => String(image.id) === String(id)) ?? null
      );
    },
    enabled: !!id,
  });
}

export function useImageBlob(id?: string) {
  return useQuery({
    queryKey: ["image-blob", id],
    queryFn: () => imageService.getBlobById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateImage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateImagePayload) => adminImageService.create(data),
    onSuccess: () => {
      toast.success("Tạo ảnh thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IMAGES });
      navigate("/admin/images");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo ảnh thất bại");
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminImageService.remove(id),
    onSuccess: () => {
      toast.success("Xoá ảnh thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IMAGES });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xoá ảnh thất bại");
    },
  });
}

export function useImageVariantOptions() {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "image-variant-options"],
    queryFn: async () => {
      const response = await productService.getAll({ limit: 1000, page: 1 });
      return Array.isArray(response) ? response : (response?.data ?? []);
    },
  });

  const variants = Array.isArray(query.data)
    ? (query.data as ProductVariant[])
    : [];

  return {
    variants,
    isLoading: query.isLoading,
    error: query.error,
  };
}
