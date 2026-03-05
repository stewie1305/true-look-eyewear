import type { ProductVariant } from "@/features/products/types";

/**
 * Cart Item - Sản phẩm trong giỏ hàng
 */
export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  price: string;
  create_at: string;
  update_at: string | null;
  variant?: ProductVariant;
}

/**
 * Cart - Giỏ hàng
 */
export interface Cart {
  id: string;
  user_id: string;
  create_at: string;
  update_at: string | null;
  items?: CartItem[];
}

/**
 * DTO để thêm sản phẩm vào giỏ
 */
export interface AddToCartDto {
  variant_id: string;
  quantity: number;
}

/**
 * DTO để cập nhật số lượng sản phẩm trong giỏ
 */
export interface UpdateCartItemDto {
  quantity: number;
}

/**
 * Response khi lấy giỏ hàng
 */
export interface MyCartResponse {
  id: string;
  user_id: string;
  create_at?: string;
  update_at?: string | null;
}
export interface AddToCartButtonProps {
  variantId: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}
