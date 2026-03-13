import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { shippingService } from "@/features/shipping/services";
import { QUERY_KEYS } from "@/shared/constants";
import type {
  CreateNhanhOrderDto,
  NhanhOrdersFilter,
} from "@/features/shipping/types";

export function useNhanhOrders(filters: NhanhOrdersFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.SHIPPING.ORDERS(filters.fromDate, filters.toDate),
    queryFn: () => shippingService.getNhanhOrders(filters),
    enabled: !!filters.fromDate && !!filters.toDate,
  });
}

export function useCreateNhanhOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNhanhOrderDto) =>
      shippingService.createNhanhOrder(data),
    onSuccess: () => {
      toast.success("Tạo đơn giao hàng Nhanh thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHIPPING.ALL });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo đơn giao hàng thất bại");
    },
  });
}
