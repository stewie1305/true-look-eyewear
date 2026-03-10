import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import {
  adminRxLensSpecService,
  rxLensSpecService,
} from "@/features/rxLenSpecs/pages/services";
import type {
  CreateRxLensSpecDto,
  RxLensSpecFilterParams,
  UpdateRxLensSpecDto,
} from "@/features/rxLenSpecs/pages/types";

export function useRxLensSpecs(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  const filters = useMemo<RxLensSpecFilterParams>(() => {
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
    queryKey: [...QUERY_KEYS.RX_LENS_SPECS, filters],
    queryFn: async () => {
      const response = await rxLensSpecService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawRxLensSpecs = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let rxLensSpecs = rawRxLensSpecs;

  if (filters.search) {
    const searchValue = filters.search.toLowerCase();
    rxLensSpecs = rxLensSpecs.filter(
      (item) =>
        item.product_id.toLowerCase().includes(searchValue) ||
        item.type.toLowerCase().includes(searchValue) ||
        item.material.toLowerCase().includes(searchValue),
    );
  }

  if (filters.product_id) {
    rxLensSpecs = rxLensSpecs.filter((item) =>
      item.product_id.toLowerCase().includes(filters.product_id!.toLowerCase()),
    );
  }

  if (options?.forceActive) {
    rxLensSpecs = rxLensSpecs.filter(
      (item) => String(item.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    rxLensSpecs = rxLensSpecs.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    rxLensSpecs,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateRxLensSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRxLensSpecDto) =>
      adminRxLensSpecService.create(data),
    onSuccess: () => {
      toast.success("Tạo tròng kính thuốc thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RX_LENS_SPECS });
      navigate("/admin/rx-lens-specs");
    },
  });
}

export function useUpdateRxLensSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRxLensSpecDto }) =>
      adminRxLensSpecService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật tròng kính thuốc thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RX_LENS_SPECS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RX_LENS_SPEC_DETAIL(variables.id),
      });
      navigate("/admin/rx-lens-specs");
    },
  });
}

export function useDeleteRxLensSpec() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRxLensSpecService.remove(id),
    onSuccess: () => {
      toast.success("Xoá tròng kính thuốc thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RX_LENS_SPECS });
    },
  });
}

export function useRxLensSpecDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RX_LENS_SPEC_DETAIL(id),
    queryFn: () => adminRxLensSpecService.getById(id),
    enabled: !!id,
  });
}
