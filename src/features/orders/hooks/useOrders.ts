import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import { QUERY_KEYS } from "@/shared/constants";
import { adminProductService } from "@/features/products/services";
import { orderService } from "../services";
import { cartItemService } from "@/features/cart/services";
import type {
  CreateOrderDto,
  OrderDetail,
  OrderFilterParams,
  OrderItem,
  OrderStatus,
} from "../types";

export function useOrdersAdmin() {
  const [searchParams] = useSearchParams();

  const filters = useMemo<OrderFilterParams>(
    () => ({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      customer_id: searchParams.get("customer_id") || undefined,
    }),
    [searchParams],
  );

  const query = useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, "admin"],
    queryFn: () => orderService.getAll(),
    placeholderData: (prev) => prev,
  });

  const rawOrders = Array.isArray(query.data) ? query.data : [];

  let orders = rawOrders;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    orders = orders.filter(
      (order) =>
        String(order.id || "")
          .toLowerCase()
          .includes(needle) ||
        String(order.customer_id || "")
          .toLowerCase()
          .includes(needle),
    );
  }

  if (filters.status) {
    const filterStatus = String(filters.status || "").toLowerCase();
    orders = orders.filter((order) => {
      const orderStatus = String(order.status || "").toLowerCase();
      if (filterStatus === "cancel") {
        return orderStatus === "cancel" || orderStatus === "shipping_failed";
      }
      return orderStatus === filterStatus;
    });
  }

  return {
    orders,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useMyOrders(userId?: string) {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, "me", userId],
    queryFn: () => orderService.getByUser(String(userId)),
    enabled: !!userId,
  });

  const orders = Array.isArray(query.data) ? query.data : [];

  return {
    orders,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(id),
    queryFn: async () => {
      const response = (await orderService.getDetails(id)) as {
        order?: Partial<OrderDetail>;
        id?: string | number;
        order_id?: string | number;
        customer_id?: string;
        total?: number | string;
        extra_fee?: number | string;
        status?: string;
        create_at?: string;
        update_at?: string | null;
        ref_id?: string;
        items?: Array<{
          id?: string | number;
          order_id?: string | number;
          variant_id?: string | number;
          price?: number | string;
          quantity?: number | string;
        }>;
        images?: any[];
      };

      const source = response.order ?? response;

      const normalizedItems: OrderItem[] = Array.isArray(response.items)
        ? response.items.map((item) => ({
            id: String(item?.id ?? ""),
            order_id: String(
              item?.order_id ?? response.order_id ?? source.id ?? id ?? "",
            ),
            variant_id: String(item?.variant_id ?? ""),
            price: Number(item?.price ?? 0),
            quantity: Number(item?.quantity ?? 0),
          }))
        : [];

      const variantIds = Array.from(
        new Set(
          normalizedItems
            .map((item) => item.variant_id)
            .filter((variantId) => Boolean(variantId)),
        ),
      );

      const variantNameMap = new Map<string, string>();
      const variantImageMap = new Map<string, string>();
      if (variantIds.length > 0) {
        const variants = await Promise.allSettled(
          variantIds.map((variantId) => adminProductService.getById(variantId)),
        );

        variants.forEach((result, index) => {
          const variantId = variantIds[index];
          if (result.status === "fulfilled") {
            const variant = result.value;
            variantNameMap.set(
              variantId,
              String(variant?.name || variant?.product?.name || variantId),
            );
            if (variant?.images && variant.images.length > 0) {
              // store image id (not path) so frontend can fetch blob via authenticated endpoint
              variantImageMap.set(variantId, String(variant.images[0].id));
            }
          }
        });
      }

      const itemsWithName = normalizedItems.map((item) => ({
        ...item,
        variant_name: variantNameMap.get(item.variant_id) || item.variant_id,
        image_id: variantImageMap.get(item.variant_id),
      }));

      const itemsTotal = itemsWithName.reduce((sum, item) => {
        const price = Number(item.price ?? 0);
        const quantity = Number(item.quantity ?? 0);
        return (
          sum +
          (Number.isFinite(price) ? price : 0) *
            (Number.isFinite(quantity) ? quantity : 0)
        );
      }, 0);

      return {
        id: String(source.id ?? response.order_id ?? id ?? ""),
        customer_id: String(source.customer_id ?? ""),
        total: Number(source.total ?? itemsTotal ?? 0),
        extra_fee: Number(source.extra_fee ?? 0),
        status: String(source.status ?? "Pending"),
        create_at: String(source.create_at ?? ""),
        update_at: (source.update_at as string | null | undefined) ?? null,
        ref_id: (source.ref_id as string | undefined) ?? undefined,
        items: itemsWithName,
        images: response.images || source.images || [],
      } as OrderDetail;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderDto) => {
      const selectedCartItemIds = (data.selected_cart_item_ids || [])
        .map((id) => String(id))
        .filter(Boolean);

      const cartItemsToRestore = selectedCartItemIds.length
        ? (await cartItemService.getMyItems()).filter(
            (item) => !selectedCartItemIds.includes(String(item.id)),
          )
        : [];

      let orderCreated = false;

      try {
        if (cartItemsToRestore.length > 0) {
          await Promise.all(
            cartItemsToRestore.map((item) => cartItemService.remove(item.id)),
          );
        }

        const order = await orderService.create(data);
        orderCreated = true;
        return order;
      } finally {
        if (cartItemsToRestore.length > 0) {
          await Promise.allSettled(
            cartItemsToRestore.map((item) =>
              cartItemService.add({
                variant_id: item.variant_id,
                quantity: item.quantity,
              }),
            ),
          );
        }

        if (!orderCreated && selectedCartItemIds.length > 0) {
          // Keep the cart consistent if order creation fails before the selected items are removed.
          await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
          await queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CART_ITEMS,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_ITEMS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo đơn hàng thất bại");
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật trạng thái thất bại");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: () => {
      toast.success("Đã hủy đơn hàng");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hủy đơn hàng thất bại");
    },
  });
}
