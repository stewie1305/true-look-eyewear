import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import type {
  CartItem,
  AddToCartDto,
  UpdateCartItemDto,
  MyCartResponse,
} from "./types";

/**
 * Service cho Cart Items
 */
export const cartItemService = {
  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  add: async (data: AddToCartDto): Promise<CartItem> => {
    const response = await apiClient.post(API_ENDPOINTS.CART_ITEMS.ADD, data);
    return response as unknown as CartItem;
  },

  /**
   * Lấy danh sách sản phẩm trong giỏ của tôi
   */
  getMyItems: async (): Promise<CartItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CART_ITEMS.MY_ITEMS);
    return response as unknown as CartItem[];
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  update: async (id: string, data: UpdateCartItemDto): Promise<CartItem> => {
    const response = await apiClient.patch(
      API_ENDPOINTS.CART_ITEMS.UPDATE(id),
      data,
    );
    return response as unknown as CartItem;
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART_ITEMS.REMOVE(id));
  },
};

/**
 * Service cho Cart
 */
export const cartService = {
  /**
   * Lấy giỏ hàng của tôi (chưa có sẽ tự động tạo)
   */
  getMyCart: async (): Promise<MyCartResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.CART.MY_CART);
    return response as unknown as MyCartResponse;
  },
};
