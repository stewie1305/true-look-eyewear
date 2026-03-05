import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { cartItemService, cartService } from "../services";
import type { AddToCartDto, UpdateCartItemDto } from "../types";

/**
 * Hook lấy giỏ hàng của user hiện tại
 */
export function useCart() {
  // Lấy cart info
  const cartQuery = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: async () => {
      console.log("🛒 Fetching cart data...");
      const response = await cartService.getMyCart();
      console.log("📦 Cart response:", response);
      return response;
    },
  });

  // Lấy cart items
  const itemsQuery = useQuery({
    queryKey: QUERY_KEYS.CART_ITEMS,
    queryFn: async () => {
      console.log("🛍️ Fetching cart items...");
      const response = await cartItemService.getMyItems();
      console.log("📦 Cart items response:", response);
      console.log("📊 First item:", response?.[0]);
      return response;
    },
  });

  // Tính toán totalItems và totalAmount từ items
  const items = itemsQuery.data || [];
  console.log("🛒 Items in hook:", items);
  const totalItems = items.length;
  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.variant?.price || 0);
    const qty = item.quantity || 1;
    console.log(
      `Item ${item.id}: price=${price}, qty=${qty}, subtotal=${price * qty}`,
    );
    return sum + price * qty;
  }, 0);
  console.log("💰 Total amount calculated:", totalAmount);

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
