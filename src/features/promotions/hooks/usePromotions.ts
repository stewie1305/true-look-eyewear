import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";
import { FULL_ADMIN_ROLES, hasAnyRole } from "@/shared/constants/roles";
import { promotionService } from "../services";
import type {
  CreatePromotionDto,
  PromotionFilterParams,
  UpdatePromotionDto,
} from "../types";

export function usePromotions() {
  const [searchParams] = useSearchParams();
  const { role, roles } = useAuthStore();
  const effectiveRoles = roles?.length ? roles : role ? [role] : [];
  const isFullAdmin = hasAnyRole(effectiveRoles, FULL_ADMIN_ROLES);

  const filters = useMemo<PromotionFilterParams>(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      name: searchParams.get("name") || undefined,
      status: searchParams.get("status") || undefined,
    }),
    [searchParams],
  );

  const query = useQuery({
    queryKey: [...QUERY_KEYS.PROMOTIONS, isFullAdmin, filters],
    queryFn: () =>
      isFullAdmin
        ? promotionService.getAllAdmin(filters)
        : promotionService.getAllActive(filters),
    placeholderData: (prev) => prev,
  });

  const raw = Array.isArray(query.data)
    ? query.data
    : ((query.data as any)?.data ?? []);

  let promotions = raw;

  if (filters.name) {
    promotions = promotions.filter((promotion: any) =>
      String(promotion?.name || "")
        .toLowerCase()
        .includes(filters.name!.toLowerCase()),
    );
  }

  if (filters.status) {
    promotions = promotions.filter(
      (promotion: any) =>
        String(promotion?.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    promotions,
    pagination: !Array.isArray(query.data)
      ? (query.data as any)?.meta
      : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function usePromotionDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROMOTION_DETAIL(id),
    queryFn: () => promotionService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePromotion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotionDto) => promotionService.create(data),
    onSuccess: () => {
      toast.success("Tạo khuyến mãi thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROMOTIONS });
      navigate("/admin/promotions");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Tạo khuyến mãi thất bại");
    },
  });
}

export function useUpdatePromotion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotionDto }) =>
      promotionService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật khuyến mãi thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROMOTIONS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROMOTION_DETAIL(variables.id),
      });
      navigate("/admin/promotions");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Cập nhật khuyến mãi thất bại");
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionService.remove(id),
    onSuccess: () => {
      toast.success("Vô hiệu hóa khuyến mãi thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROMOTIONS });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Vô hiệu hóa thất bại");
    },
  });
}
