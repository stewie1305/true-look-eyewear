import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { promotionService } from "@/features/promotions/services";
import type {
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionFilterParams,
} from "@/features/promotions/types";
import { useAuthStore } from "@/features/auth/store";

export function usePromotions(options?: { adminMode?: boolean }) {
  const [searchParams] = useSearchParams();
  const role = useAuthStore((s) => s.role);

  const filters = useMemo<PromotionFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      name: searchParams.get("name") || undefined,
      money: searchParams.get("money")
        ? Number(searchParams.get("money"))
        : undefined,
      status: searchParams.get("status") || undefined,
    };
  }, [searchParams]);

  const isAdmin = role === "admin" || options?.adminMode;

  const query = useQuery({
    queryKey: [...QUERY_KEYS.PROMOTIONS, filters, isAdmin ? "admin" : "public"],
    queryFn: async () => {
      const response = isAdmin
        ? await promotionService.getAllAdmin(filters)
        : await promotionService.getAllActive(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });

  const rawPromotions = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  let promotions = rawPromotions;
  if (filters.name) {
    const needle = filters.name.toLowerCase();
    promotions = promotions.filter((p: any) =>
      String(p.name || "").toLowerCase().includes(needle),
    );
  }

  if (typeof filters.money === "number" && !Number.isNaN(filters.money)) {
    promotions = promotions.filter(
      (p: any) => Number(p.condition || 0) <= filters.money!,
    );
  }

  return {
    promotions,
    pagination: !Array.isArray(query.data) ? query.data?.meta : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
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
    onError: (error: any) => {
      toast.error(error?.message || "Tạo khuyến mãi thất bại");
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
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật khuyến mãi thất bại");
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
    onError: (error: any) => {
      toast.error(error?.message || "Vô hiệu hóa khuyến mãi thất bại");
    },
  });
}

export function usePromotionDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROMOTION_DETAIL(id),
    queryFn: () => promotionService.getById(id),
    enabled: !!id,
  });
}
