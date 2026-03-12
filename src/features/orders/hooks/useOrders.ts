import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { orderService } from "../services";
import type {
  CreateOrderDto,
  OrderFilterParams,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from "../types";

export function useOrders() {
  const [searchParams] = useSearchParams();

  const filters = useMemo<OrderFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      customer_id: searchParams.get("customer_id") || undefined,
      status: searchParams.get("status") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, filters],
    queryFn: () => orderService.getAll(filters),
    placeholderData: (prev) => prev,
  });

  const rawOrders = Array.isArray(query.data)
    ? query.data
    : ((query.data as any)?.data ?? []);

  let orders = rawOrders;

  if (filters.search) {
    const needle = filters.search.toLowerCase();
    orders = orders.filter((order: any) => {
      const orderId = String(order?.id || "").toLowerCase();
      const customerId = String(order?.customer_id || "").toLowerCase();
      return orderId.includes(needle) || customerId.includes(needle);
    });
  }

  if (filters.customer_id) {
    orders = orders.filter(
      (order: any) =>
        String(order?.customer_id || "").toLowerCase() ===
        filters.customer_id?.toLowerCase(),
    );
  }

  if (filters.status) {
    orders = orders.filter(
      (order: any) =>
        String(order?.status || "").toLowerCase() ===
        filters.status?.toLowerCase(),
    );
  }

  return {
    orders,
    pagination: !Array.isArray(query.data)
      ? (query.data as any)?.meta
      : undefined,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useOrdersByUser(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS_BY_USER(userId || ""),
    queryFn: () => orderService.getByUserId(userId!),
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        toast.error("Tài khoản hiện tại chưa có quyền tạo đơn hàng");
        return;
      }
      toast.error(error?.message || "Tạo đơn hàng thất bại");
    },
  });
}

export function useUpdateOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      orderService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDER_DETAIL(variables.id),
      });
      navigate("/admin/orders");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật đơn hàng thất bại");
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.remove(id),
    onSuccess: () => {
      toast.success("Xóa đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa đơn hàng thất bại");
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      orderService.updateStatus(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDER_DETAIL(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật trạng thái thất bại");
    },
  });
}
