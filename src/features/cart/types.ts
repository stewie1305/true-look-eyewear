import type { ProductVariant } from "@/features/products/types";

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


export interface Cart {
  id: string;
  user_id: string;
  create_at: string;
  update_at: string | null;
  items?: CartItem[];
}

export interface AddToCartDto {
  variant_id: string;
  quantity: number;
}


export interface UpdateCartItemDto {
  quantity: number;
}

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
