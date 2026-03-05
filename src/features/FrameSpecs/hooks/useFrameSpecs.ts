import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { adminFrameSpecService, frameSpecService } from "@/features/FrameSpecs/services";
import type {
  CreateFrameSpecDto,
  FrameSpecFilterParams,
  UpdateFrameSpecDto,
} from "@/features/FrameSpecs/types";

export function useFrameSpecs(options?: { forceActive?: boolean }) {
  const [searchParams] = useSearchParams();

  const filters = useMemo<FrameSpecFilterParams>(() => {
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
    queryKey: [...QUERY_KEYS.FRAME_SPECS, filters],
    queryFn: async () => {
      const response = await frameSpecService.getAll(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawFrameSpecs = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let frameSpecs = rawFrameSpecs;

  if (filters.search) {
    const searchValue = filters.search.toLowerCase();
    frameSpecs = frameSpecs.filter(
      (item) =>
        item.product_id.toLowerCase().includes(searchValue) ||
        item.type.toLowerCase().includes(searchValue) ||
        item.material.toLowerCase().includes(searchValue) ||
        item.shape.toLowerCase().includes(searchValue),
    );
  }

  if (filters.product_id) {
    frameSpecs = frameSpecs.filter((item) =>
      item.product_id.toLowerCase().includes(filters.product_id!.toLowerCase()),
    );
  }

  if (options?.forceActive) {
    frameSpecs = frameSpecs.filter(
      (item) => String(item.status || "").toLowerCase() === "active",
    );
  } else if (filters.status) {
    frameSpecs = frameSpecs.filter(
      (item) =>
        String(item.status || "").toLowerCase() === filters.status?.toLowerCase(),
    );
  }

  return {
    frameSpecs,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateFrameSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFrameSpecDto) => adminFrameSpecService.create(data),
    onSuccess: () => {
      toast.success("Tao frame spec thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRAME_SPECS });
      navigate("/admin/frame-specs");
    },
  });
}

export function useUpdateFrameSpec() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFrameSpecDto }) =>
      adminFrameSpecService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cap nhat frame spec thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRAME_SPECS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRAME_SPEC_DETAIL(variables.id),
      });
      navigate("/admin/frame-specs");
    },
  });
}

export function useDeleteFrameSpec() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminFrameSpecService.remove(id),
    onSuccess: () => {
      toast.success("Xoa frame spec thanh cong!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRAME_SPECS });
    },
  });
}

export function useFrameSpecDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.FRAME_SPEC_DETAIL(id),
    queryFn: () => adminFrameSpecService.getById(id),
    enabled: !!id,
  });
}
