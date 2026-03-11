import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { cartItemService, cartService } from "../services";
import type { AddToCartDto, UpdateCartItemDto } from "../types";

export function useCart() {
  const cartQuery = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: async () => {
     
      const response = await cartService.getMyCart();
      
      return response;
    },
  });

  const itemsQuery = useQuery({
    queryKey: QUERY_KEYS.CART_ITEMS,
    queryFn: async () => {
      const response = await cartItemService.getMyItems();
      return response;
    },
  });

  const items = itemsQuery.data || [];
  const totalItems = items.length;
  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.variant?.price || 0);
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  return {
    cart: cartQuery.data,
    items,
    totalItems,
    totalAmount,
    isLoading: cartQuery.isLoading || itemsQuery.isLoading,
    error: cartQuery.error || itemsQuery.error,
  };
}

/**
 * Hook lấy danh sách cart items
 */
export function useCartItems() {
  const query = useQuery({
    queryKey: QUERY_KEYS.CART_ITEMS,
    queryFn: () => cartItemService.getMyItems(),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });

  return {
    items: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook thêm sản phẩm vào giỏ
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartDto) => cartItemService.add(data),
    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      // Invalidate cả cart và cart items để refresh data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_ITEMS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể thêm sản phẩm vào giỏ hàng");
    },
  });
}

/**
 * Hook cập nhật số lượng sản phẩm trong giỏ
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCartItemDto }) =>
      cartItemService.update(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật số lượng!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_ITEMS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật số lượng");
    },
  });
}

/**
 * Hook xóa sản phẩm khỏi giỏ
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartItemService.remove(id),
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_ITEMS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể xóa sản phẩm");
    },
  });
}
